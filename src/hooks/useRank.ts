import { useEffect, useState } from "react";
import { AllRank, NearRank, Rank, TopRank } from "../models/rank.model";
import { fetchAllRank, fetchNearRank, fetchRank, fetchTopRank } from "../api/rank.api";

export const useRank = () => {
  const [userRank, setUserRank] = useState<Rank | null>(null);
  const [topRank, setTopRank] = useState<TopRank | null>(null);
  const [nearRank, setNearRank] = useState<NearRank | null>(null);
  const [allRank, setAllRank] = useState<AllRank | null>(null);
  const [page, setPage] = useState<number>(1);
  const limit = 10;

  const fetchUserData = async () => {
    try {
      const userRankData = await fetchRank();
      setUserRank(userRankData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchTopRankData = async () => {
    try {
      const topRankData = await fetchTopRank();
      setTopRank(topRankData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchNearRankData = async () => {
    try {
      const nearRankData = await fetchNearRank();
      setNearRank(nearRankData);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllRankData = async (page: number, limit: number) => {
    try {
      const allRankData = await fetchAllRank(page, limit);
      setAllRank(allRankData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchTopRankData();
    fetchNearRankData();
    fetchAllRankData(page, limit);
  }, []);

  return { 
    userRank, 
    topRank, 
    nearRank, 
    allRank, 
    setPage, 
    page, 
    limit, 
    fetchAllRankData 
  };
};
