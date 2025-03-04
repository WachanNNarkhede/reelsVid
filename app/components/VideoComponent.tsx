import { IKVideo } from "imagekitio-next";
import Link from "next/link";
import { IVideo } from "@/models/Video";
import { DeleteIcon } from "lucide-react";
import { useState } from "react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const [loading, setloading] = useState(false);

  const handledelete = async (videoids: string | undefined) => {
    if (!videoids) {
      console.error("Video ID is undefined");
      return;
    }

    try {
      setloading(true);
      const response = await fetch("/api/videos", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: videoids })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Deleting failed");
      }
    
      window.location.reload();
    } catch (error) {
      setloading(false);
      console.error("Not able to delete", error);
    }finally{
      setloading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow hover:shadow-lg transition-all duration-300">
      <figure className="relative px-4 pt-4">
        <Link href={`/videos/${video._id}`} className="relative group w-full">
          <div
            className="rounded-xl overflow-hidden relative w-full"
            style={{ aspectRatio: "9/16" }}
          >
            <IKVideo
              path={video.videoUrl}
              transformation={[
                {
                  height: "1920",
                  width: "1080",
                },
              ]}
              controls={video.controls}
              className="w-full h-full object-cover"
            />
          </div>
        </Link>
      </figure>

      {
        loading && (
          <div className="toast toast-end">

  <div className="alert alert-success">
    <span>Deleting Video...</span>
  </div>
</div>
        )
      }

      <div className="card-body p-4">
        <Link
          href={`/videos/${video._id}`}
          className="hover:opacity-80 transition-opacity"
        >
          <h2 className="card-title text-lg">{video.title}</h2>
        </Link>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
        <DeleteIcon 
          onClick={() => { handledelete(video._id?.toString()) }} 
          className="absolute top-2 right-2" 
        />
      </div>
    </div>
  );
}