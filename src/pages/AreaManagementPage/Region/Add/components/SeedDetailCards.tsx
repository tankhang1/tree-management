import { Group } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import SeedDetailCard from "./SeedDetailCard";
import { useState } from "react";

type SeedDetailCardsProps = {
  isMultiple?: boolean;
  isTouchable?: boolean;
  isDelete?: boolean;
};
const soybeanCornSeeds = [
  {
    imageUrl:
      "https://lh6.googleusercontent.com/proxy/MkmLTr7RaC47H6aLuMX0yGGlXhtKf77bRQ0sEwVhPiHI01aj7WPJYpuBWIbN422tMgVbH5Z67gqzUj9h-LmQpjem8pVrKg",
    seedCode: "DN-DT84",
    seedName: "Đậu nành DT84",
    supplier: "Trung tâm Giống Cây Trồng",
    origin: "Việt Nam",
    germinationRate: 88,
    uniformityRate: 72,
    yieldPerHectare: "2.2 tấn/ha",
  },
  {
    imageUrl:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxNvmzOr65QezHLAx9jp82a_wLJNjCzSuexA&s",
    seedCode: "DN-DX11",
    seedName: "Đậu nành ĐX11",
    supplier: "Viện KH Nông nghiệp VN",
    origin: "Việt Nam",
    germinationRate: 90,
    uniformityRate: 75,
    yieldPerHectare: "2.4 tấn/ha",
  },
  {
    imageUrl:
      "https://file.hstatic.net/1000034685/file/dau-nanh-gia-si_74da865e5ac14b7a8970b5107fcd422b.jpg",
    seedCode: "DN-HL02",
    seedName: "Đậu nành HL02",
    supplier: "Công ty Giống Hạt Dầu",
    origin: "Việt Nam",
    germinationRate: 92,
    uniformityRate: 78,
    yieldPerHectare: "2.6 tấn/ha",
  },
  {
    imageUrl:
      "https://storage.ssc.com.vn/Data/2021/05/18/lvn10-3-637569497051796680.jpg?w=620&h=350",
    seedCode: "BP-LVN10",
    seedName: "Bắp LVN10",
    supplier: "SSC",
    origin: "Việt Nam",
    germinationRate: 94,
    uniformityRate: 80,
    yieldPerHectare: "9.0 tấn/ha",
  },
  {
    imageUrl: "https://anvanthinh.com/multidata/m-yellow-corn-285.jpg",
    seedCode: "BP-VN886",
    seedName: "Bắp vàng VN886",
    supplier: "Trung tâm Giống Quốc gia",
    origin: "Việt Nam",
    germinationRate: 93,
    uniformityRate: 79,
    yieldPerHectare: "8.5 tấn/ha",
  },
];
const SeedDetailCards = ({
  isMultiple,
  isTouchable = true,
  isDelete = false,
}: SeedDetailCardsProps) => {
  const [selectedSeeds, setSelectedSeeds] = useState<string[]>([]);

  const onSelectSeed = (seedCode: string) => {
    if (!isTouchable) return;
    if (!isMultiple) {
      setSelectedSeeds([seedCode]);
      return;
    }
    if (!selectedSeeds.includes(seedCode)) {
      setSelectedSeeds((prev) => [...prev, seedCode]);
    } else {
      setSelectedSeeds((prev) => prev.filter((code) => code !== seedCode));
    }
  };

  return (
    <Scrollable>
      <Group wrap="nowrap" p="xs">
        {soybeanCornSeeds.map((s) => (
          <SeedDetailCard
            key={s.seedCode}
            imageUrl={s.imageUrl}
            seedCode={s.seedCode}
            seedName={s.seedName}
            supplier={s.supplier}
            origin={s.origin}
            germinationRate={s.germinationRate}
            uniformityRate={s.uniformityRate}
            yieldPerHectare={s.yieldPerHectare}
            isMultiple={isMultiple}
            isActive={selectedSeeds.includes(s.seedCode)}
            onClick={() => onSelectSeed(s.seedCode)}
            isDelete={isDelete}
          />
        ))}
      </Group>
    </Scrollable>
  );
};

export default SeedDetailCards;
