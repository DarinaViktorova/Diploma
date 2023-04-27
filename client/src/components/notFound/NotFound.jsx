import sadCatImage from "./sad_cat.png";

const NotFound = () => {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 70px)' }}>
        <div style={{ textAlign: 'center' }}>
          <img src={sadCatImage} alt="Page not found" style={{ maxWidth: '50%', height: 'auto' }} />
          <h2 style={{ color: '#6c757d' }}>404 | Not Found ...</h2>
        </div>
      </div>
    );
  };
  
  export default NotFound;
  