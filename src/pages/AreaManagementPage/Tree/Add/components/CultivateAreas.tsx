import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import Scrollable from "../../../../../components/Scrollable";
import { useState } from "react";
const cultivationAreas = [
  {
    areaName: "Khu vực canh tác Đồng Nai",
    zone: "Khu A",
    subArea: "",
    lot: "Lô A1, Lô A2",
    areaSize: "10.000 m²",
    manager: "Nguyễn Văn A",
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
  },
  {
    areaName: "Khu vực canh tác Đồng Nai",
    zone: "Khu B",
    subArea: "",
    lot: "Lô B1, Lô B2",
    areaSize: "8.500 m²",
    manager: "Trần Thị B",
    soilType: "Đất phù sa",
    terrain: ["Thấp", "Trũng"],
  },
  {
    areaName: "Khu vực canh tác Tây Nguyên",
    zone: "Khu C",
    subArea: "",
    lot: "Lô C1, Lô C2",
    areaSize: "6.000 m²",
    manager: "Lê Văn C",
    soilType: "Đất cát",
    terrain: ["Bằng phẳng"],
  },
  {
    areaName: "Khu vực canh tác Tây Nguyên",
    zone: "Khu D",
    subArea: "",
    lot: "Lô D1, Lô D2",
    areaSize: "12.000 m²",
    manager: "Phạm Thị D",
    soilType: "Đất đỏ bazan",
    terrain: ["Cao", "Bằng phẳng"],
  },
  {
    areaName: "Khu vực canh tác Miền Tây",
    zone: "Khu E",
    subArea: "",
    lot: "Lô E1, Lô E2",
    areaSize: "9.500 m²",
    manager: "Nguyễn Văn E",
    soilType: "Đất thịt",
    terrain: ["Dốc", "Thấp"],
  },
  {
    areaName: "Khu vực canh tác Miền Tây",
    zone: "Khu F",
    subArea: "Khu F5",
    lot: "Lô F1, Lô F2",
    areaSize: "7.000 m²",
    manager: "Hoàng Thị F",
    soilType: "Đất phù sa",
    terrain: ["Trũng"],
  },
  {
    areaName: "Khu vực canh tác Miền Trung",
    zone: "Khu G",
    subArea: "Khu G6",
    lot: "Lô G61, Lô G62",
    areaSize: "11.000 m²",
    manager: "Vũ Văn G",
    soilType: "Đất thịt",
    terrain: ["Cao", "Dốc"],
  },
  {
    areaName: "Khu vực canh tác Miền Trung",
    zone: "Khu H",
    subArea: "",
    lot: "Lô H1, Lô H2",
    areaSize: "8.000 m²",
    manager: "Trần Văn H",
    soilType: "Đất đỏ bazan",
    terrain: ["Bằng phẳng"],
  },
];
type CultivateAteasProps = {
  isMultiple?: boolean;
};
const CultivateAteas = ({ isMultiple }: CultivateAteasProps) => {
  const [selectedArea, setSelectedArea] = useState<string[]>([]);
  const onSelectArea = (area: string) => {
    if (isMultiple) {
      setSelectedArea((prev) =>
        prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
      );
    } else {
      setSelectedArea([area]);
    }
  };
  return (
    <Scrollable h={250}>
      <Group wrap="nowrap" align="flex-start" gap="md" p={"xs"}>
        {cultivationAreas.map((area) => (
          <Card
            onClick={() => onSelectArea(area.zone)}
            withBorder
            shadow="sm"
            radius="md"
            miw={400}
            h={250}
            padding="lg"
            style={{
              cursor: "pointer",
              position: "relative",
              transition: "transform 0.2s ease",
              borderColor: selectedArea.includes(area.zone)
                ? "green"
                : undefined,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.02)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            <Stack gap="sm">
              <Title order={4}>{area.zone}</Title>
              <Text size="sm">
                <strong>Khu vực:</strong> {area.areaName}
              </Text>
              {area.subArea && (
                <Text size="sm">
                  <strong>Khu vực phụ:</strong> {area.subArea}
                </Text>
              )}
              {area.lot && (
                <Text size="sm">
                  <strong>Lô:</strong> {area.lot}
                </Text>
              )}
              <Text size="sm">
                <strong>Diện tích:</strong> {area.areaSize}
              </Text>
              <Text size="sm">
                <strong>Quản lý:</strong> {area.manager}
              </Text>
              <Text size="sm">
                <strong>Loại đất:</strong> {area.soilType}
              </Text>
              <Group gap="xs">
                {area.terrain.map((t, i) => (
                  <Badge key={i} variant="light" color="green">
                    {t}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        ))}
      </Group>
    </Scrollable>
  );
};

export default CultivateAteas;
