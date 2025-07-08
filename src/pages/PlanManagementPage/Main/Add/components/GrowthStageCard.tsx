import {
  Card,
  Title,
  Stack,
  Group,
  Select,
  NumberInput,
  Button,
  Divider,
} from "@mantine/core";
import { IconBox, IconTool, IconVaccine } from "@tabler/icons-react";

interface ResourceItem {
  item: string;
  quantity: number;
}

interface GrowthStageCardProps {
  stageName: string;
  materials: ResourceItem[];
  equipment: ResourceItem[];
  pesticides: ResourceItem[];
  onAddMaterial: () => void;
  onAddEquipment: () => void;
  onAddPesticide: () => void;
  onChangeMaterial: (
    index: number,
    key: "item" | "quantity",
    value: number
  ) => void;
  onChangeEquipment: (
    index: number,
    key: "item" | "quantity",
    value: number
  ) => void;
  onChangePesticide: (
    index: number,
    key: "item" | "quantity",
    value: number
  ) => void;
}

const GrowthStageCard = ({
  stageName,
  materials,
  equipment,
  pesticides,
  onAddMaterial,
  onAddEquipment,
  onAddPesticide,
  onChangeMaterial,
  onChangeEquipment,
  onChangePesticide,
}: GrowthStageCardProps) => {
  return (
    <Card withBorder radius={4} shadow="sm" p="md">
      <Stack gap="xs">
        <Group justify="space-between">
          <Title order={4}>{stageName}</Title>
          <NumberInput
            label="Thời gian dữ kiến ( ngày )"
            radius={4}
            w={150}
            placeholder="VD: 30"
          />
        </Group>

        <Divider label="Vật tư" labelPosition="center" />
        {materials.map((mat, index) => (
          <Group key={index} grow>
            <Select
              label="Vật tư"
              placeholder="Chọn vật tư"
              data={["Phân NPK", "Vôi bột"]}
              radius={4}
              leftSection={<IconBox size={16} />}
              value={mat.item}
              onChange={(val) => onChangeMaterial(index, "item", +val!)}
            />
            <NumberInput
              label="Số lượng"
              placeholder="0"
              radius={4}
              min={0}
              value={mat.quantity}
              onChange={(val) => onChangeMaterial(index, "quantity", +val)}
            />
          </Group>
        ))}
        <Button
          variant="light"
          onClick={onAddMaterial}
          radius={4}
          leftSection={<IconBox size={16} />}
        >
          + Thêm vật tư
        </Button>

        <Divider label="Thiết bị" labelPosition="center" />
        {equipment.map((eq, index) => (
          <Group key={index} grow>
            <Select
              label="Thiết bị"
              placeholder="Chọn thiết bị"
              data={["Máy xịt", "Bình tưới"]}
              radius={4}
              leftSection={<IconTool size={16} />}
              value={eq.item}
              onChange={(val) => onChangeEquipment(index, "item", +val!)}
            />
            <NumberInput
              label="Số lượng"
              placeholder="0"
              min={0}
              radius={4}
              value={eq.quantity}
              onChange={(val) => onChangeEquipment(index, "quantity", +val)}
            />
          </Group>
        ))}
        <Button
          variant="light"
          onClick={onAddEquipment}
          radius={4}
          leftSection={<IconTool size={16} />}
        >
          + Thêm thiết bị
        </Button>

        <Divider label="Thuốc BVTV" labelPosition="center" />
        {pesticides.map((pest, index) => (
          <Group key={index} grow>
            <Select
              label="Thuốc BVTV"
              placeholder="Chọn thuốc"
              data={["Confidor", "Radiant"]}
              leftSection={<IconVaccine size={16} />}
              value={pest.item}
              radius={4}
              onChange={(val) => onChangePesticide(index, "item", +val!)}
            />
            <NumberInput
              label="Số lượng"
              placeholder="0"
              min={0}
              radius={4}
              value={pest.quantity}
              onChange={(val) => onChangePesticide(index, "quantity", +val)}
            />
          </Group>
        ))}
        <Button
          variant="light"
          onClick={onAddPesticide}
          radius={4}
          leftSection={<IconVaccine size={16} />}
        >
          + Thêm thuốc BVTV
        </Button>
      </Stack>
    </Card>
  );
};

export default GrowthStageCard;
