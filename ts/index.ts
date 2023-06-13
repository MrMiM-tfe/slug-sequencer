import { Schema, Model} from 'mongoose';
import slugify from "slugify"

function ValidateSlug(slug: string) {
    
    if (!slug) return false
    
    const regexExp = /^[A-Za-z0-9]+(?:-[A-Za-z0-9]+)*$/;
    return regexExp.test(slug)
}

async function GenerateSlug(field: string, doc: any, model: Model<any, {}, {}, {}, any>) {
    // check if slug is modified by user or not
    if (!ValidateSlug(doc.slug)) {
        doc.slug = slugify(doc[field])
    }

    const similar = await model.findOne({slug: doc.slug})
    if (!similar) return doc.slug as string

    const regexPattern = new RegExp(`^${doc.slug}-\\d+$`)

    const data = (await model.find({slug: regexPattern}).sort("-slug").limit(1))[0]
    
    if (data) {
        // get latest counter number
        const count = data.slug.split("-").pop()

        // generate next counter number
        const StrNumber = !isNaN(Number(count)) ? (Number(count) + 1).toString() : "1"

        // concatenate slug with number
        doc.slug = doc.slug + "-" + StrNumber
    }else {
        doc.slug = doc.slug + "-1"
    }

    return doc.slug as string
}

type Plugin<T> = (schema: Schema<T>) => void;

export const slugSequencer: <T>(fromField: string) => Plugin<T> = (fromField: string) => {
  return <T>(schema: Schema<T>) => {
    schema.pre<T>('save', async function (this :any, next: Function) {
      
      const model = this.constructor as Model<T>;

      this.slug = await GenerateSlug(fromField, this, model)

      next();
    });
  };
};
