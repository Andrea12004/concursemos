// types.ts
export interface Room {
  id: number;
  room_name: string;
  room_code: string;
  start_date: string | null;
  state: string;
  max_user: number;
  number_questions: number;
  time_question: number;
}

export interface SimpleSliderProps {
  searchQuery: string;
}

export interface SliderSettings {
  dots: boolean;
  infinite: boolean;
  autoplay: boolean;
  speed: number;
  autoplaySpeed: number;
  slidesToShow: number;
  slidesToScroll: number;
}