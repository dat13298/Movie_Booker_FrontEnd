import React, {useEffect, useState} from 'react';
import {Swiper, SwiperSlide} from 'swiper/react';
import {Navigation, Pagination, Autoplay} from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import '../styles/homeSections.css';
import MovieCard from './MovieCard.jsx';
import api from "@/api/axios.js";

const mockData = {
    now: [
        {
            id: 1,
            title: 'INSIDE OUT 2',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=https%3A%2F%2Fapi.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018182_0.jpg&w=256&q=75',
            genre: 'Hoạt hình',
            duration: 100,
            type: '2D',
            actors: 'Amy Poehler, Phyllis Smith',
            releaseDate: '23/05/2025',
            description: 'Riley bước vào tuổi mới với những cảm xúc mới đầy thách thức trong cuộc sống học đường và gia đình.',
            trailer: 'https://www.youtube.com/embed/KTK6JKdC0KQ?list=RDKTK6JKdC0KQ'
        },
        {
            id: 2,
            title: 'BAD BOYS: RIDE OR DIE',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=https%3A%2F%2Fapi.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018545_0.jpg&w=256&q=75',
            genre: 'Hành động',
            duration: 110,
            type: '2D',
            actors: 'Will Smith, Martin Lawrence',
            releaseDate: '24/05/2025',
            description: 'Cặp đôi cảnh sát trở lại để đối đầu với một âm mưu khủng khiếp đe dọa thành phố Miami.',
            trailer: 'https://www.youtube.com/watch?v=example2'
        },
        {
            id: 3,
            title: 'LẬT MẶT 8',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=https%3A%2F%2Fapi.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018564_0.jpg&w=256&q=75',
            genre: 'Tâm lý',
            duration: 120,
            type: '2D',
            actors: 'Lý Hải, Huy Khánh',
            releaseDate: '27/04/2025',
            description: 'Phần tiếp theo trong loạt phim “Lật Mặt” với những tình tiết kịch tính và cảm động.',
            trailer: 'https://www.youtube.com/watch?v=example3'
        },
        {
            id: 4,
            title: 'DORAEMON',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=https%3A%2F%2Fapi.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018421_0.jpg&w=256&q=75',
            genre: 'Hoạt hình',
            duration: 90,
            type: '2D',
            actors: 'Wasabi Mizuta, Megumi Oohara',
            releaseDate: '23/05/2025',
            description: 'Nobita và Doraemon bước vào thế giới tranh vẽ kỳ diệu để giải cứu một người bạn đặc biệt.',
            trailer: 'https://www.youtube.com/watch?v=example4'
        },
        {
            id: 5,
            title: 'BÍ KÍP LUYỆN RỒNG',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=https%3A%2F%2Fapi.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018758_0.jpg&w=256&q=75',
            genre: 'Phiêu lưu',
            duration: 105,
            type: '3D',
            actors: 'Jay Baruchel, America Ferrera',
            releaseDate: '13/06/2025',
            description: 'Câu chuyện về tình bạn giữa một cậu bé Viking và chú rồng Toothless.',
            trailer: 'https://www.youtube.com/watch?v=example5'
        },
        {
            id: 6,
            title: '28 NĂM SAU',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=https%3A%2F%2Fapi.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018339_0.jpg&w=256&q=75',
            genre: 'Kinh dị',
            duration: 108,
            type: '2D',
            actors: 'Aaron Taylor-Johnson, Ralph Fiennes, Cillian Murphy',
            releaseDate: '20/06/2025',
            description: 'Virus chết chóc trở lại và một cuộc hành trình sinh tử để tìm kiếm hy vọng cứu lấy nước Anh.',
            trailer: 'https://www.youtube.com/watch?v=example6'
        }
    ],
    upcoming: [
        {
            id: 7,
            title: 'Deadpool & Wolverine',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=https%3A%2F%2Fapi.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018421_0.jpg&w=256&q=75',
            genre: 'Siêu anh hùng',
            duration: 130,
            type: 'IMAX 3D',
            actors: 'Ryan Reynolds, Hugh Jackman',
            releaseDate: '15/07/2025',
            description: 'Deadpool hợp tác cùng Wolverine trong một cuộc hành trình phá vỡ rào cản không gian và thời gian.',
            trailer: 'https://www.youtube.com/watch?v=example7'
        }
    ],
    festival: [
        {
            id: 8,
            title: 'Tuần phim Nhật Bản',
            image: 'https://chieuphimquocgia.com.vn/_next/image?url=https%3A%2F%2Fapi.chieuphimquocgia.com.vn%2FContent%2FImages%2F0018421_0.jpg&w=256&q=75',
            genre: 'Văn hóa',
            duration: 120,
            type: '2D',
            actors: 'Nhiều đạo diễn Nhật Bản',
            releaseDate: '01/07/2025',
            description: 'Tuyển tập các bộ phim đặc sắc đến từ Nhật Bản, tổ chức trong khuôn khổ liên hoan phim.',
            trailer: 'https://www.youtube.com/watch?v=example8'
        }
    ],
    deals: [
        {
            id: 9,
            title: 'Khuyến mãi cuối tuần',
            image: 'https://chieuphimquocgia.com.vn/uploads/promo/weekendpromo.jpg',
            genre: 'Khuyến mãi',
            duration: 0,
            type: '',
            actors: '',
            releaseDate: '',
            description: 'Giảm giá vé lên đến 50% cho các suất chiếu cuối tuần tại rạp Quốc Gia.',
            trailer: ''
        }
    ],
    events: [
        {
            id: 10,
            title: 'Giao lưu diễn viên',
            image: 'https://chieuphimquocgia.com.vn/uploads/event/meet_cast.jpg',
            genre: 'Sự kiện',
            duration: 0,
            type: '',
            actors: 'Nghệ sĩ Việt Nam',
            releaseDate: '30/06/2025',
            description: 'Cơ hội gặp gỡ, giao lưu trực tiếp cùng các diễn viên nổi tiếng tại sảnh chính rạp.',
            trailer: ''
        }
    ]
};

function Section({title, data}) {
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        fetchMovies();
    },[])

    const fetchMovies = async () => {
        try {
            const data = await api.get("/movies");
            console.log(data.data.content);
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="section">
            <h2 className="section-title">{title}</h2>
            <Swiper
                spaceBetween={12}
                navigation
                pagination={{clickable: true}}
                autoplay={{delay: 4000}}
                modules={[Navigation, Pagination, Autoplay]}
                breakpoints={{
                    0: {slidesPerView: 1.2},
                    480: {slidesPerView: 2},
                    768: {slidesPerView: 3},
                    1024: {slidesPerView: 4},
                }}
            >
                {data.map((item) => (
                    <SwiperSlide key={item.id}>
                        <div style={{display: 'flex', justifyContent: 'center'}}>
                            <MovieCard movie={item}/>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}

export default function MovieSections() {
    return (
        <div className="movie-sections">
            <Section title="Phim đang chiếu" data={mockData.now}/>
            <Section title="Phim sắp chiếu" data={mockData.upcoming}/>
            <Section title="Liên hoan / Tuần phim" data={mockData.festival}/>
            <Section title="Khuyến mãi" data={mockData.deals}/>
            <Section title="Sự kiện" data={mockData.events}/>
        </div>
    );
}
