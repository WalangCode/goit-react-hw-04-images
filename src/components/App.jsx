import React, { useCallback, useState, useEffect } from 'react';
import SearchBar from './Searchbar/Searchbar';
import ImageGallery from './ImageGallery/ImageGallery';
import Button from './Button/Button';
import Loader from './Loader/Loader';
import { getAPI } from 'pixabay-api';
import styles from './App.module.css';
import { TailSpin } from 'react-loader-spinner';
import { Toaster,toast } from 'react-hot-toast';



function App() {
const [images, setImages]=useState([]);
const [currentPage, setCurrentPage]=useState(1);
const [searchQuery, setSearchQuery]=useState('');
const [isLoading, setIsLoading]=useState(false);
const [isError, setIsError]=useState(false);
const [isEnd, setIsEnd] = useState(false);

const fetchImages=useCallback(async()=>{
  setIsLoading(true);
  try {
    const response= await getAPI(searchQuery, currentPage);
    const {totalHits, hits}=response;

    setImages(prevImages => currentPage===1 ? hits: [...prevImages,...hits]);

    setIsEnd(prevImages => prevImages.length + hits.length >= totalHits);

    if (hits.length ===0){
     
      toast.error('No images found. Try a different serach. ')
    }
  } catch (error) {
    setIsLoading(false);
    setIsError(true);
    alert(`An error occurred while fetching data: ${error}`);
  }finally {
      setIsLoading(false);
    }
},[searchQuery,currentPage]);

 useEffect(() => {
    if (searchQuery) {
      fetchImages();
    }
  }, [fetchImages]);

  const handleSearchSubmit = query => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery === '') {
      alert('Empty string is not a valid search query. Please type again.');
      return;
    }

    if (normalizedQuery === searchQuery.toLowerCase()) {
      alert('Search query is the same as the previous one. Please provide a new search query.');
      return;
    }

    setSearchQuery(normalizedQuery);
    setCurrentPage(1);
    setImages([]);
    setIsEnd(false);
  };

  const handleLoadMore = () => {
    if (!isEnd) {
      setCurrentPage(prevPage => prevPage + 1);
    } else {
      alert("You've reached the end of the search results.");
    }
  };

  return (
    <div className={styles.App}>
      <SearchBar onSubmit={handleSearchSubmit} />
      <Toaster
  position="top-center"
  reverseOrder={false}
/>

     <TailSpin
      visible={true}
           height="80"
           width="80"
           color="#4fa94d"
           ariaLabel="tail-spin-loading"
           radius="1"
           wrapperStyle={{}}
           wrapperClass=""
       />
      
      <Loader visible={isLoading} height="80" width="80" color="#4fa94d" />
      
      <ImageGallery images={images} />
      
      {!isLoading && !isError && images.length > 0 && !isEnd && (
        <Button onClick={handleLoadMore} />
      )}
      
      {isError && <p>Something went wrong. Please try again later.</p>}
    </div>
  )
}

export default App
// class App extends Component {
//   state = {
//     images: [],

//     currentPage: 1,
//     searchQuery: '',
//     isLoading: false,
//     isError: false,
//     isEnd: false,
//   };

//   async componentDidUpdate(_prevProps, prevState) {
//     const { searchQuery, currentPage } = this.state;

//     if (
//       prevState.searchQuery !== searchQuery ||
//       prevState.currentPage !== currentPage
//     ) {
//       await this.fetchImages();
//     }
//   }

//   fetchImages = async () => {
//     this.setState({ isLoading: true, isError: false });

//     const { searchQuery, currentPage } = this.state;

//     try {
//       const response = await getAPI(searchQuery, currentPage);
//       console.log(response);
//       const { totalHits, hits } = response;

//       this.setState(prevState => ({
//         images: currentPage === 1 ? hits : [...prevState.images, ...hits],
//         isLoading: false,
//         isEnd: prevState.images.length + hits.length >= totalHits,
//       }));

//       if (hits.length === 0) {
//         alert('No images found. Try a different search.');
//         return;
//       }
//     } catch (error) {
//       this.setState({ isLoading: false, isError: true });
//       alert(`An error occurred while fetching data: ${error}`);
//     }
//   };

//   handleSearchSubmit = query => {
//     const normalizedQuery = query.trim().toLowerCase();
//     const normalizedCurrentQuery = this.state.searchQuery.toLowerCase();

//     if (normalizedQuery === '') {
//       alert(`Empty string is not a valid search query. Please type again.`);
//       return;
//     }

//     if (normalizedQuery === normalizedCurrentQuery) {
//       alert(
//         `Search query is the same as the previous one. Please provide a new search query.`
//       );
//       return;
//     }

//     // Only update the state and fetch images if the new query is different
//     if (normalizedQuery !== normalizedCurrentQuery) {
//       this.setState({
//         searchQuery: normalizedQuery,
//         currentPage: 1,
//         images: [],
//         isEnd: false,
//       });
//     }
//   };

//   handleLoadMore = () => {
//     if (!this.state.isEnd) {
//       this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
//     } else {
//       alert("You've reached the end of the search results.");
//     }
//   };

//   render() {
//     const { images, isLoading, isError, isEnd } = this.state;
//     return (
//       <div className={styles.App}>
        
//         <SearchBar onSubmit={this.handleSearchSubmit} />
        
//         <TailSpin
//           visible={true}
//           height="80"
//           width="80"
//           color="#4fa94d"
//           ariaLabel="tail-spin-loading"
//           radius="1"
//           wrapperStyle={{}}
//           wrapperClass=""
//         />
        
        
//         <ImageGallery images={images} />
//         {isLoading && <Loader />}
//         {!isLoading && !isError && images.length > 0 && !isEnd && (
//           <Button onClick={this.handleLoadMore} />
//         )}
//         {isError && <p>Something went wrong. Please try again later.</p>}
//       </div>
//     );
//   }
// }

// export default App;
