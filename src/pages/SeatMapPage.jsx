import SeatMap from "@/components/SeatMap";
import { useParams } from "react-router-dom";
import '../components/SeatMap.css'

export default function SeatMapPage() {
    const { id } = useParams();

    return (
        /*  <── wrapper mới  ──> */
        <div className="booking-wrapper">
            <SeatMap showTimeId={id} />
        </div>
    );
}
