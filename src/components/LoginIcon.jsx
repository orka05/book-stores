import useUser from "../context/useUser.jsx";
import style from "../component_style/decoration.module.css";

export const LoginIcon = () => {
  const { userId } = useUser();

  return (
    <svg
      className={`${userId ? style.reverse : null} bg`}
      width="42"
      height="42"
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="M17 12L10.5 12" stroke="#333333" strokeWidth="2" />
      <path d="M13 9L10.5 12" stroke="#333333" strokeWidth="2" />
      <path
        d="M13 15L10.5 12"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M17 17C17 19.2091 15.2091 20 13 20H10C7.79086 20 6 18.2091 6 16V8C6 5.79086 7.79086 4 10 4H13C15.2091 4 17 4.79086 17 7"
        stroke="#333333"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
