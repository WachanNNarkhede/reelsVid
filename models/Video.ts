import mongoose, { Schema, model, models } from "mongoose";


export const VIDEO_DIMENSION = {
    width:1080,
    height:1920,
}as const 

export interface IVideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  controls: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  transformation?:{
    hight:number;
    width:number;
    quality?:number
  } 
}

  const videoSchema = new Schema<IVideo>({
    title:{
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String,
        required: true
    },
    thumbnailUrl: {
        type: String,
        required: true
    },
    controls: {
        type: Boolean,
        required: true
    },
    transformation: {
        hight: {
            type: Number,
            default: VIDEO_DIMENSION.height},
        width: {
            type: Number,
            default: VIDEO_DIMENSION.width
        },
        quality: {
            type: Number,
            min: 1,
            max: 100
        }
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
  }, {
    timestamps: true
})

const Video = models?.Video || model<IVideo>("Video", videoSchema);

export default Video;
