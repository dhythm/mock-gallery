import { Link } from "react-router-dom";
export function Brand() {
  return <Link className="brand" to="/" aria-label="現場モック集 ホーム"><span className="brand-mark" aria-hidden="true"><i /><i /><i /><i /></span><span>現場モック集<small>GENBA / INTERACTIVE COLLECTION</small></span></Link>;
}
