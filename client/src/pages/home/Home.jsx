import Topbar from '../../components/topbar/Topbar';
import Feed from '../../components/feed/Feed';
import './home.css';

const Home = () => {
    return (
        <>
            <Topbar />
            <div className="homeContainer">
                <Feed />
            </div>
        </>
    )
}

export default Home;