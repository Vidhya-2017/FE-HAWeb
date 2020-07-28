import React from 'react';
const skeletonArr = [0,1,2,3,4];

const CandidateSkeleton = () => (
    <div className="candidateSkeleton">
    {skeletonArr.map(list =>
    <div key={list} className="skeletonWrapper">
      <div className="skeletonProfilePic animate"></div>
      <div className="skeletonCmtContainer">
        <p className="skeletonComment br animate w60"></p>
        <p className="skeletonComment br animate w40"></p>
        <p className="skeletonComment br animate w70"></p>
      </div>
    </div>)}
  </div>
)

export default CandidateSkeleton;