import {useLocation} from "react-router-dom";

export default function useUrlParams() {
  return new URLSearchParams(useLocation().search)
}