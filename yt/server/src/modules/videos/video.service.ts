import { Video, VideoModel } from "./video.models";

export function createVideo({ owner }: { owner: string }) {
  return VideoModel.create({ owner });
}


export function findVideo(videoId: Video['videoId']) {
  return VideoModel.findOne({videoId})
}

export function findVideos() {
  return VideoModel.find({
    published: true
  }).lean() // using lean returns POJO, instead of mongoose object
}