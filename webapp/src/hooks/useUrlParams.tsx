import {useLocation} from "react-router-dom";

/**
 * Get the params from the current url
 */
export default function useUrlParams() {
  return new URLSearchParams(useLocation().search)
}