import { Link } from "react-router-dom";

export default function LinkNav({ to, name, icon }) {
  return (
    <li>
      <Link to={to}>
        {icon}
        {name}
      </Link>
    </li>
  );
}
