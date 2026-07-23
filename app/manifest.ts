import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'HITSZ OpenAuto (hoa.moe)',
    short_name: 'hoa.moe',
    description: '哈尔滨工业大学（深圳）开源自动化与全校课程资料共享平台',
    start_url: '/',
    display: 'standalone',
    background_color: '#09090b',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  };
}
