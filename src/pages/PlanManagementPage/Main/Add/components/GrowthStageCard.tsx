import {
  Card,
  Title,
  Stack,
  Group,
  Select,
  NumberInput,
  Button,
  Divider,
  Text,
  Badge,
  ThemeIcon,
  Paper,
} from "@mantine/core";
import { IconBox, IconTool, IconVaccine, IconClock } from "@tabler/icons-react";

interface ResourceItem {
  item: string;
  quantity: number;
}

interface GrowthStageCardProps {
  stageName: string;
  materials: ResourceItem[];
  equipment: ResourceItem[];
  pesticides: ResourceItem[];
  mode?: "edit" | "view";
  onAddMaterial?: () => void;
  onAddEquipment?: () => void;
  onAddPesticide?: () => void;
  onChangeMaterial?: (
    index: number,
    key: "item" | "quantity",
    value: string | number
  ) => void;
  onChangeEquipment?: (
    index: number,
    key: "item" | "quantity",
    value: string | number
  ) => void;
  onChangePesticide?: (
    index: number,
    key: "item" | "quantity",
    value: string | number
  ) => void;
}

const GrowthStageCard = ({
  stageName,
  materials,
  equipment,
  pesticides,
  mode = "edit",
  onAddMaterial,
  onAddEquipment,
  onAddPesticide,
  onChangeMaterial,
  onChangeEquipment,
  onChangePesticide,
}: GrowthStageCardProps) => {
  const isEdit = mode === "edit";

  const renderViewList = (
    icon: React.ReactNode,
    color: string,
    items: ResourceItem[]
  ) => (
    <Stack gap={4}>
      {items.map((it, idx) => (
        <Group key={idx}>
          <Paper
            p="xs"
            radius={4}
            withBorder
            style={{ backgroundColor: `${color}15` }}
          >
            <Group>
              <ThemeIcon size="sm" radius={4} color={color} variant="light">
                {icon}
              </ThemeIcon>
              <Text fw={500}>{it.item}</Text>
            </Group>
          </Paper>
        </Group>
      ))}
    </Stack>
  );

  return (
    <Card withBorder radius={8} shadow="sm" p="md">
      <Stack gap="xs">
        <Group justify="space-between" align="center">
          <Title order={4}>{stageName}</Title>
          {isEdit ? (
            <NumberInput
              label="Thời gian dự kiến (ngày)"
              radius={4}
              w={150}
              placeholder="VD: 30"
            />
          ) : (
            <Badge
              leftSection={<IconClock size={14} />}
              color="blue"
              variant="light"
            >
              30 ngày
            </Badge>
          )}
        </Group>

        {/* --- VẬT TƯ --- */}
        <Divider label="Vật tư" labelPosition="center" />
        {isEdit
          ? materials.map((mat, index) => (
              <Group key={index} grow>
                <Select
                  searchable
                  clearable
                  label="Vật tư"
                  placeholder="Chọn vật tư"
                  data={["Phân NPK", "Vôi bột"]}
                  radius={4}
                  leftSection={<IconBox size={16} />}
                  value={mat.item}
                  onChange={(val) =>
                    onChangeMaterial?.(index, "item", val || "")
                  }
                />
                <NumberInput
                  label="Số lượng"
                  placeholder="0"
                  radius={4}
                  min={0}
                  value={mat.quantity}
                  onChange={(val) =>
                    onChangeMaterial?.(index, "quantity", val || 0)
                  }
                />
              </Group>
            ))
          : renderViewList(<IconBox size={16} />, "teal", materials)}

        {isEdit && (
          <Button
            variant="light"
            onClick={onAddMaterial}
            radius={4}
            leftSection={<IconBox size={16} />}
          >
            + Thêm vật tư
          </Button>
        )}

        {/* --- THIẾT BỊ --- */}
        <Divider label="Thiết bị" labelPosition="center" />
        {isEdit
          ? equipment.map((eq, index) => (
              <Group key={index} grow>
                <Select
                  searchable
                  clearable
                  label="Thiết bị"
                  placeholder="Chọn thiết bị"
                  data={["Máy xịt", "Bình tưới"]}
                  radius={4}
                  leftSection={<IconTool size={16} />}
                  value={eq.item}
                  onChange={(val) =>
                    onChangeEquipment?.(index, "item", val || "")
                  }
                />
                <NumberInput
                  label="Số lượng"
                  placeholder="0"
                  min={0}
                  radius={4}
                  value={eq.quantity}
                  onChange={(val) =>
                    onChangeEquipment?.(index, "quantity", val || 0)
                  }
                />
              </Group>
            ))
          : renderViewList(<IconTool size={16} />, "orange", equipment)}

        {isEdit && (
          <Button
            variant="light"
            onClick={onAddEquipment}
            radius={4}
            leftSection={<IconTool size={16} />}
          >
            + Thêm thiết bị
          </Button>
        )}

        {/* --- THUỐC BVTV --- */}
        <Divider label="Thuốc BVTV" labelPosition="center" />
        {isEdit
          ? pesticides.map((pest, index) => (
              <Group key={index} grow>
                <Select
                  searchable
                  clearable
                  label="Thuốc BVTV"
                  placeholder="Chọn thuốc"
                  data={["Confidor", "Radiant"]}
                  leftSection={<IconVaccine size={16} />}
                  value={pest.item}
                  radius={4}
                  onChange={(val) =>
                    onChangePesticide?.(index, "item", val || "")
                  }
                />
                <NumberInput
                  label="Số lượng"
                  placeholder="0"
                  min={0}
                  radius={4}
                  value={pest.quantity}
                  onChange={(val) =>
                    onChangePesticide?.(index, "quantity", val || 0)
                  }
                />
              </Group>
            ))
          : renderViewList(<IconVaccine size={16} />, "red", pesticides)}

        {isEdit && (
          <Button
            variant="light"
            onClick={onAddPesticide}
            radius={4}
            leftSection={<IconVaccine size={16} />}
          >
            + Thêm thuốc BVTV
          </Button>
        )}
      </Stack>
    </Card>
  );
};

export default GrowthStageCard;
