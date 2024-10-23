import React, { Fragment, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos } from '../../slices/featSlice';

const Course = () => {

  const dispatch = useDispatch();
  const { videos, totalVideos, pageSize, currentPage, totalPages, videoLoading, videoError } = useSelector(state => state.feat);

  useEffect(() => {
    dispatch(getVideos({ page: currentPage, size: pageSize, classOp: 7, subject: 'Maths' }));
  }, [dispatch, currentPage, pageSize]);

  const handlePageChange = (newPage) => {
    dispatch(getVideos({ page: newPage, size: pageSize, classOp: 7, subject: 'Maths' }));
  };

  const Pagination = () => {
    const pageNumbers = [...Array(totalPages).keys()].map(num => num + 1);
    return (
      <div className="pagination">
        {pageNumbers.map(number => (
          <button key={number} onClick={() => handlePageChange(number)} disabled={currentPage === number}>
            {number}
          </button>
        ))}
      </div>
    );
  };

  return (
    <Fragment>
      <Helmet>
        <title>Sai Classes</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/videos" />
      </Helmet>

      <div className="page flexcol center">
        <h1>Videos Page</h1>
        {videoLoading && <p>Loading videos...</p>}
        {videoError && <p>Error: {videoError}</p>}
        <div className="video-grid">
          {videos.map(video => (
            <div className="video-card" key={video._id}>
              <iframe width="100%" height="200" src={video.videoLink} title={video.subject} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen>
              </iframe>
              <h3>{video.subject} (Class: {video.classOp})</h3>
            </div>
          ))}
        </div>
        {totalPages > 1 && <Pagination />}
      </div>
    </Fragment>
  )
}

export default Course