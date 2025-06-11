import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div>
            <h1>Home Page</h1>
            <Link to="/movies">Go to Movie List</Link>
            <br />
            <Link to="/login">Login</Link>
        </div>
    );
};

export default Home;
