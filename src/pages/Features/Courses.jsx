import React, { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos } from '../../slices/featSlice';


const Course = () => {

  const dispatch = useDispatch();
  const { videos, totalVideos, pageSize, currentPage, totalPages, videoLoading, videoError } = useSelector(state => state.feat);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(getVideos({ page: currentPage, size: pageSize, classOp: user.classOp, subject: '' }));
  }, [dispatch, currentPage, pageSize, user.classOp]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(getVideos({ page: newPage, size: pageSize, classOp: user.classOp, subject: '' }));
    }
  };  

  return (
    <Fragment>
      <Helmet>
        <title>Sai Classes</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/videos" />
      </Helmet>

      <div className="page flexcol start-center">
        <h1 className="heading">Videos</h1>

        {videoLoading && <p>Loading videos...</p>}
        {videoError && <p>Error: {videoError}</p>}
        {!videoLoading && !videoError && videos.length === 0 && <p>No videos available.</p>}
        <p>Showing {currentPage} out of {totalPages} pages </p>

        <div className="video-list">
          {videos.map((video, index) => (
            <div key={index} className="video-item">
              <div className="flex minBox center-start">
                <p>{video.subject}</p>
                <p>{video.classOp}</p>
              </div>

              <a href={video.videoLink} target="_blank" rel="noopener noreferrer">
                Download
              </a>
            </div>
          ))}
        </div>

        {totalVideos > pageSize && (
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)}>
              Previous
            </button>
            <span>{`Page ${currentPage} of ${totalPages}`}</span>
            <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)}>
              Next
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Course;
