import { useEffect, useState } from 'react';
import { Replica } from '@/services/tavusService';
import { tavusApi } from '@/services/api/tavus';

export const useTavusVideo = () => {
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const replica = await tavusApi.getReplica();
        if (replica.thumbnail_video_url) {
          setVideoUrl(replica.thumbnail_video_url);
        }
      } catch (err) {
        setError('Failed to load AI companion video');
        console.error('Error fetching Tavus video:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, []);

  return { videoUrl, loading, error };
};
