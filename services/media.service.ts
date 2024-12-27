import Service from '.';

class MediaService extends Service {
  constructor() {
    super();
  }

  async createMedia(file: { url: string; type: string }) {
    const media = await this.db.media.create({
      data: {
        url: file.url.replace(
          '/f/',
          `/a/${process.env.NEXT_PUBLIC_UPLOADTHING_APP_ID}/`
        ),
        type: file.type.startsWith('image') ? 'IMAGE' : 'VIDEO',
      },
    });

    return media;
  }
}

export default MediaService;
