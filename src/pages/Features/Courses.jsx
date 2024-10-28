import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos } from '../../slices/featSlice';
import { Link } from 'react-router-dom';


const Course = () => {

  const dispatch = useDispatch();
  const { videos, totalVideos, pageSize, currentPage, totalPages, videoLoading, videoError } = useSelector(state => state.feat);
  const user = useSelector((state) => state.auth.user);
  const [sub, setSub] = useState('');

  useEffect(() => {
    dispatch(getVideos({ page: currentPage, size: pageSize, classOp: user.classOp, subject: sub }));
  }, [dispatch, currentPage, pageSize, user.classOp, sub]);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      dispatch(getVideos({ page: newPage, size: pageSize, classOp: user.classOp, subject: sub }));
    }
  };

  const handleSubFilter = (event) => {
    setSub(event.target.value);
  };

  return (
    <Fragment>
      <Helmet>
        <title>Courses</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/videos" />
      </Helmet>

      <div className="page flexcol start-center">
        <h1 className="heading">Videos</h1>

        {videoLoading && <p>Loading videos...</p>}
        {videoError && <p>{videoError}</p>}
        {!videoLoading && !videoError && videos?.length === 0 && <p>No videos available.</p>}
        {!videoLoading && !videoError && videos?.length > 0 &&
          <div className="flex center-space wh">
            <p>Showing {videos.length} out of {totalVideos} videos </p>
            <select className='filterselect' name="filter" id="filter" onChange={handleSubFilter}>
              <option value=''>Select Subject</option>
              {user?.subjects?.length > 0 && user.subjects.map((subs, index) => (
                <option key={index} value={subs}>{subs}</option>
              ))}
            </select>
          </div>
        }

        <div className="video-list">
          {videos.map((video, index) => (
            <div key={index} className="video-item">
              <div className="flex minBox center-start">
                <p>{video.subject}</p>
                <p>{video.classOp}</p>
              </div>
              <Link to={`/stream/${video.publicId}`}>
                Watch
              </Link>
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
