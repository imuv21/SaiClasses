import React, { Fragment, useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { getVideos } from '../../slices/featSlice';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';


const Course = () => {

  const dispatch = useDispatch();
  const { videoLoading, videoError, videos, totalVideos, totalPages, pageVideos, isFirst, isLast, hasNext, hasPrevious } = useSelector(state => state.feat);
  const user = useSelector((state) => state.auth.user);
  const [sub, setSub] = useState('');
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    dispatch(getVideos({ page, size, classOp: user.classOp, subject: sub, sortBy, order }));
  }, [dispatch, currentPage, pageSize, user.classOp, sub]);


  //pagination
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  const getPageNumbers = (currentPage, totalPages) => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage < maxPageButtons - 1) {
      if (startPage === 1) {
        endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    return pageNumbers;
  };
  const pageNumbers = getPageNumbers(page, totalPages);

  const toggleOrder = () => {
    setOrder(prevOrder => (prevOrder === "asc" ? "desc" : "asc"));
  };

  const handleSubFilter = (event) => {
    setSub(event.target.value);
  };

  if (videoLoading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <Helmet>
        <title>Courses</title>
        <meta name="description" content="Join SaiClasses today for academic excellence and success in school exams"></meta>
        <link rel="canonical" href="https://saiclasses.netlify.app/videos" />
      </Helmet>

      <div className="page flexcol start-center">
        <h1 className="heading">Videos</h1>

        <div className="sortCat">
          <div className="flexcol">
            <h1 className="heading" style={{ textTransform: 'capitalize' }}>{categoryName || `All Products`}</h1>
            <p className="text">Showing {pageVideos || 0} of {totalVideos || 0} products</p>
          </div>

          <div className="flex center g10">
            <select name="sort" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">Sort By</option>
              <option value="boughtCounter">Popularity</option>
              <option value="salePrice">Price</option>
              <option value="title">Title</option>
              <option value="averageRating">Ratings</option>
            </select>
            <div className="orderfilter" onClick={toggleOrder}>
              {order === "asc" ? <NorthIcon /> : <SouthIcon />}
            </div>
          </div>
        </div>

        <div className="flex center-space wh">
          <select className='filterselect' name="filter" id="filter" onChange={handleSubFilter}>
            <option value=''>Select Subject</option>
            {user?.subjects?.length > 0 && user.subjects.map((subs, index) => (
              <option key={index} value={subs}>{subs}</option>
            ))}
          </select>
        </div>

        <div className="video-list">
          {videoError ? (<p className='text'>Error loading videos!</p>) :
            !videoLoading && !videoError && videos && videos.length > 0 ? videos.map((video, index) => (
              <div key={index} className="video-item">
                <div className="flex minBox center-start">
                  <p className='text'>{video.vidTitle}</p>
                  <p className='text'>{video.subject}</p>
                  <p className='text'>{video.classOp}</p>
                </div>
                <Link to={`/stream/${video.publicId}`}>Watch</Link>
              </div>
            )) : (<p className='text'>No videos found!</p>)}
        </div>

        {!videoLoading && !videoError && totalVideos > size && (
          <div className="pagination">
            <div className="flex wh" style={{ gap: '10px' }}>
              <button className='pagination-btn' onClick={() => handlePageChange(1)} disabled={isFirst}>
                First Page
              </button>
              <button className='pagination-btn' onClick={() => handlePageChange(page - 1)} disabled={!hasPrevious}>
                Previous
              </button>
            </div>
            <div className="flex wh" style={{ gap: '10px' }}>
              {pageNumbers.map(index => (
                <button key={index} className={`pagination-btn ${index === page ? 'active' : ''}`} onClick={() => handlePageChange(index)}>
                  {index}
                </button>
              ))}
            </div>
            <div className="flex wh" style={{ gap: '10px' }}>
              <button className='pagination-btn' onClick={() => handlePageChange(page + 1)} disabled={!hasNext}>
                Next
              </button>
              <button className='pagination-btn' onClick={() => handlePageChange(totalPages)} disabled={isLast}>
                Last Page
              </button>
            </div>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Course;
