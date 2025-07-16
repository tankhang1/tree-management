import {
  Card,
  Title,
  Text,
  Stack,
  Divider,
  Group,
  Box,
  TextInput,
  NumberInput,
  Textarea,
  Button,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

interface SubArea {
  id: string;
  latitude: number;
  longitude: number;
  area: number;
  note?: string;
}

interface Area {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  area: number;
  note?: string;
  subAreas: SubArea[];
}

export default function StockManagementAreaDetailPage() {
  const navigate = useNavigate();
  const [area] = useState<Area | null>({
    id: "213",
    name: "Khu A1",
    latitude: 10.762622,
    longitude: 106.660172,
    area: 1500,
    note: "Khu chính gần hồ trung tâm",
    subAreas: [
      {
        id: "PHU-1",
        latitude: 10.7628,
        longitude: 106.6603,
        area: 500,
        note: "Khu phụ phía Bắc",
      },
      {
        id: "PHU-2",
        latitude: 10.7625,
        longitude: 106.66,
        area: 600,
        note: "Khu phụ phía Nam",
      },
    ],
  });

  if (!area) return <Text>Đang tải dữ liệu...</Text>;

  return (
    <Card withBorder shadow="sm" radius={4} p="lg">
      <Group mb={"md"}>
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3} mb="md">
          📋 Chi tiết khu vực: {area.name}
        </Title>
      </Group>

      <Card withBorder mb="lg" shadow="xs" radius="md">
        <Title order={5} mb="xs">
          Khu vực chính
        </Title>
        <Stack gap="xs">
          <TextInput
            label="Tên khu vực"
            value={area.name}
            readOnly
            radius={4}
          />
          <Group grow>
            <TextInput
              label="Vĩ độ"
              value={area.latitude.toString()}
              readOnly
              radius={4}
            />
            <TextInput
              label="Kinh độ"
              value={area.longitude.toString()}
              readOnly
              radius={4}
            />
          </Group>
          <NumberInput
            label="Diện tích (m²)"
            value={area.area}
            readOnly
            radius={4}
          />
          <Textarea
            label="Ghi chú"
            value={area.note || "Không có"}
            readOnly
            radius={4}
          />
          <Box mt="xs">
            <iframe
              title="map"
              width="100%"
              height="300"
              style={{ borderRadius: 8, border: 0 }}
              loading="lazy"
              allowFullScreen
              src={`https://www.google.com/maps?q=${area.latitude},${area.longitude}&z=15&output=embed`}
            />
          </Box>
        </Stack>
      </Card>

      {area.subAreas.length > 0 && (
        <>
          <Divider
            label={`Danh sách ${area.subAreas.length} khu phụ`}
            labelPosition="center"
            mb="md"
          />
          <Stack gap="sm">
            {area.subAreas.map((s, idx) => (
              <Card key={s.id} withBorder shadow="xs" radius="md">
                <Title order={6}>Khu phụ {idx + 1}</Title>
                <Stack gap="xs" mt="xs">
                  <Group grow>
                    <TextInput
                      label="Vĩ độ"
                      value={s.latitude.toString()}
                      readOnly
                      radius={4}
                    />
                    <TextInput
                      label="Kinh độ"
                      value={s.longitude.toString()}
                      readOnly
                      radius={4}
                    />
                  </Group>
                  <NumberInput
                    label="Diện tích (m²)"
                    value={s.area}
                    readOnly
                    radius={4}
                  />
                  <Textarea
                    label="Ghi chú"
                    value={s.note || "Không có"}
                    readOnly
                    radius={4}
                  />
                  <Box mt="xs">
                    <iframe
                      title={`map-sub-${idx}`}
                      width="100%"
                      height="250"
                      style={{ borderRadius: 8, border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      src={`https://www.google.com/maps?q=${s.latitude},${s.longitude}&z=15&output=embed`}
                    />
                  </Box>
                </Stack>
              </Card>
            ))}
          </Stack>
        </>
      )}
    </Card>
  );
}
