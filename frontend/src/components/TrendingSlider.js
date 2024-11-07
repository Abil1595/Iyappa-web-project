import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios'; // Import axios for API requests
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import core Swiper styles
import 'swiper/css/pagination'; // Import pagination styles
import './ppc.css'; // Custom CSS
import { Link } from 'react-router-dom';

const TrendingSlider = () => {
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [activeIndex, setActiveIndex] = useState(0); // Active slide index
  const [loading, setLoading] = useState(true); // Loading state for API call
  const [error, setError] = useState(null); // Error state for API call
  const swiperRef = useRef(null); // Reference to Swiper instance

  useEffect(() => {
    // Fetch products with stock === 25 from the API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5500/api/v1/products', {
          params: { categories: "popular" } // Pass stock filter as a query parameter
        });
        
        // Assuming response.data.products contains the list of products
        setProducts(response.data.products || []); // Adjust if API response structure is different
        setLoading(false); // Set loading to false once data is fetched
      } catch (error) {
        setError("Error fetching products. Please try again.");
        setLoading(false); // Stop loading if error occurs
      }
    };

    fetchProducts();

    // Set up autoplay with setInterval
    const autoPlay = setInterval(() => {
      if (swiperRef.current) {
        swiperRef.current.swiper.slideNext(); // Move to the next slide
      }
    }, 5000); // Change slide every 5 seconds

    // Clear interval on component unmount
    return () => clearInterval(autoPlay);
  }, []); // Empty dependency array ensures it runs once on mount

  if (loading) {
    return <p>Loading products...</p>; // Show loading message while fetching data
  }

  return (
    <section id="trending">
      <p className="offer-title">POPULAR PRODUCTS</p>
      <div className="container">
        <Swiper
          ref={swiperRef} // Attach the ref to Swiper
          grabCursor={true}
          centeredSlides={true} // Keep the center slide in focus
          loop={true}
          slidesPerView={3} // Show three slides at a time
          spaceBetween={0} // No space between slides
          onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
          pagination={{
            clickable: true,
            renderBullet: (index, className) => {
              return `<span class="${className}">${index + 1}</span>`;
            }
          }}
        >
          {/* Check if products is an array before mapping */}
          {Array.isArray(products) && products.length > 0 ? (
            products.map((slide, index) => (
              <SwiperSlide
                key={index}
                className={`swiper-slide trending-slide ${activeIndex === index ? 'active' : ''}`}
                style={{
                  transform: activeIndex === index ? 'scale(1.2)' : 'scale(0.9)', // Scale center slide larger
                  transition: 'transform 0.3s ease-in-out' // Smooth scaling transition
                }}
              >
                <div className="trending-slide-img">
                  <img src={slide.images[0].image} className="img-fluid" alt={slide.name} />
                </div>
                <Link to={`/product/${slide._id}`}> <div className="trending-slide-content">
                  <h1 className="food-price">{slide.price}</h1>
                  <div className="trending-slide-content-bottom">
                    <h2 className="food-name">{slide.name}</h2>
                    <h3 className="food-rating" >
                      <span>{slide.rating}</span>
                      <div className="rating"  >
                        {[...Array(5)].map((_, i) => (
                          <ion-icon
                            key={i}
                            name={i < Math.floor(slide.rating) ? 'star' : 'star-outline'}
                          />
                        ))}
                      </div>
                    </h3>
                  </div>
                </div></Link>
              </SwiperSlide>
            ))
          ) : (
            <p>No products available with stock 25</p> // Show a message if no products are found
          )}
        </Swiper>
      </div>
      {error && <p>{error}</p>} {/* Display error message if there's an error */}
    </section>
  );
};

export default TrendingSlider;
