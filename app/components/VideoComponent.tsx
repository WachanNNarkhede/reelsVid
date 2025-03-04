import { IKVideo } from "imagekitio-next";
import { IVideo } from "@/models/Video";
import {   Trash2Icon } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function VideoComponent({ video }: { video: IVideo }) {
  const { data: session } = useSession();
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
      <h2 className="card-title text-lg">{video.title}</h2>

        <p className="text-sm text-base-content/70 line-clamp-2">
          {video.description}
        </p>
        {(session?.user.role === "superadmin" || session?.user.role === "admin") && (
          <Trash2Icon 
          onClick={() => { handledelete(video._id?.toString()) }} 
          className="absolute  right-4 hover:text-red-500 cursor-pointer" 
        />
        )}
        
       
      </div>
    </div>
  );
}