import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import * as videoService from "./videoService";
import { Video } from "./Video";

type InputChange = ChangeEvent<HTMLInputElement | HTMLTextAreaElement>;

interface Params {
  id?: string;
}

const VideoForm = () => {
  const initialState = {
    title: "",
    description: "",
    url: "",
  };

  const [video, setVideo] = useState<Video>(initialState);

  const history = useHistory();
  const params = useParams<Params>();

  const getVideo = async (id: string) => {
    const res = await videoService.getVideoById(id);
    const { title, description, url } = res.data;
    setVideo({ title, description, url });
  };

  useEffect(() => {
    if (params.id) getVideo(params.id);
  }, [params.id]);

  const handleInputChange = (e: InputChange) =>
    setVideo({ ...video, [e.target.name]: e.target.value });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!params.id) {
      await videoService.createNewVideo(video);
      setVideo(initialState);
      toast.success("New Video Added");
    } else {
      await videoService.updateVideo(params.id, video);
    }
    history.push("/videos");
  };

  return (
    <div className="row">
          <div className="col-md-4 offset-md-4">
                  <div className="card text-white bg-info mb-3">
                      <div className="card-body">
                          <h3>New Video</h3>
                          <form onSubmit={handleSubmit}>
                             <div className="form-group">
                             <input type="text" name="title" placeholder="Write the title for this Video" className="form-control"
                             autoFocus
                             onChange={handleInputChange}
                             />
                             </div>
                             <div className="form-group">
                             <input type="text" name="url" placeholder="www.youtube.com" className="form-control"
                             autoFocus
                             onChange={handleInputChange}
                             />
                             </div>
                             <div className="form-group">
                                 <textarea name="description" rows={3} className="form-control"
                                 placeholder="Write the Description"
                                 autoFocus
                                onChange={handleInputChange}
                                 ></textarea>
                             </div>
                                    {
                                        params.id ?    
                                       ( <button className="btn btn-primary btn-xl form-control" >
                                        Update Video!
                                        </button> )
                                        :
                                       ( <button className="btn btn-primary btn-xl form-control" >
                                        Share Video!
                                        </button>  )                
                                    }

                           

                          </form>
                      </div>
                  </div>
              
          </div>
      </div>
  );
};

export default VideoForm;
