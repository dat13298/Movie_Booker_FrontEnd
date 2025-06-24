import {MovieDetail} from "@/components/MovieDetail.jsx";
import {Button, message} from "antd";

const Home = () => {
    return (
        <div>
            <Button
                onClick={() => message.success("Nút ngoài modal hoạt động")}
            >
                Gọi Message
            </Button>
        </div>
    );
};

export default Home;
