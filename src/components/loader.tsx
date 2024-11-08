const Loader = () => {
  return <div>Loader...</div>;
};

export const Skeleton = ({width="unset" }:{width?:string}) => {
  return (
    <div className="skeleton-loader" style={{width}}>
      <div className="skeleton-box" style={{width}}> </div>
      <div className="skeleton-box"></div>
      <div className="skeleton-box"></div>
    </div>
  );
};

export default Loader;
