import Application from "@/api/app";
import { AppContext } from "@/store/app";
import { useEffect, useState } from "react";

function AppProvider({ children }: { children: React.ReactNode }) {
  const [brandInfo, setBrandInfo] = useState<{
    last_update: string;
    logo: string;
    name: string;
    headline: string;
    primary_color: string;
    secondary_color: string;
    tone: string;
    focus_area: string;
  }>();
  const [wellnessScore, setWellnessScore] = useState({
    scores: [] as Array<{ name?: string; score?: number | string | null }>,
    latest_date: null as string | null,
  });

  useEffect(() => {
    Application.getBrandInfo()
      .then((res: any) => {
        setBrandInfo(res.data.brand_elements);
      })
      .catch(() => {});

    Application.getWellnessScores()
      .then((res: any) => {
        const scores = Array.isArray(res?.data?.scores) ? res.data.scores : [];
        setWellnessScore({
          scores,
          latest_date: res?.data?.latest_date ?? null,
        });
      })
      .catch(() => {
        setWellnessScore({ scores: [], latest_date: null });
      });
  }, []);

  return (
    <AppContext.Provider
      value={{
        brandInfo: brandInfo || {
          last_update: "",
          logo: "",
          name: "",
          headline: "",
          primary_color: "",
          secondary_color: "",
          tone: "",
          focus_area: "",
        },
        wellnessScore: wellnessScore,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export default AppProvider;
