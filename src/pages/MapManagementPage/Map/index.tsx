import {
  Box,
  Button,
  Drawer,
  Group,
  Paper,
  Select,
  Stack,
  Text,
  TextInput,
} from "@mantine/core";
import { IconChevronLeft, IconMapPin, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { CompanyList } from "../../../components/CompanyList";
import { areaOptions, plotOptions } from "../../AreaManagementPage/Row/Add";
import AreaCards from "../../AreaManagementPage/Zone/Add/components/AreaCards";
import PlotCardSelector from "../../AreaManagementPage/Row/Add/components/PlotCards";
import MapBox from "../../AreaManagementPage/Region/Detail/components/Map";

const MapManagementMapPage = () => {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <Stack pos={"relative"}>
      <MapBox h={810} area plot zone zoom={17} />
      <Group pos={"absolute"} bottom={10} style={{ zIndex: 9999 }} pl={"lg"}>
        <Group gap={4}>
          <Box w={10} h={10} style={{ borderRadius: 100 }} bg="red" />
          <Text c={"white"}>Musang King Durian</Text>
        </Group>
        <Group gap={4}>
          <Box w={10} h={10} style={{ borderRadius: 100 }} bg="blue" />
          <Text c={"white"}>Monthong Durian (Dona)</Text>
        </Group>
      </Group>
      <Paper
        withBorder
        radius={4}
        shadow="lg"
        pos="absolute"
        top={24}
        p="lg"
        w={420}
        right={24}
        style={{
          zIndex: 9999,
          background: "linear-gradient(135deg, #f8fafc 0%, #e6f4ec 100%)",
          border: "1px solid #e0e0e0",
          boxShadow: "0 4px 24px 0 rgba(76,175,80,0.08)",
        }}
      >
        <Stack gap="md">
          <Group gap={10}>
            <Stack bg="brand.5" p={8} style={{ borderRadius: 12 }}>
              <IconMapPin size={24} color="white" />
            </Stack>
            <Text fw={700} size="lg" c="brand.7">
              Thông tin vị trí
            </Text>
          </Group>
          <Stack gap={8}>
            <Group gap={8}>
              <IconChevronLeft size={18} color="#388E3C" />
              <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                Doanh nghiệp / Nông hộ:
              </Text>
              <Text size="sm" fw={600} c="brand.7">
                Công ty Mevi
              </Text>
            </Group>
            <Group gap={8}>
              <IconMapPin size={18} color="#388E3C" />
              <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                Mã địa chính:
              </Text>
              <Text size="sm" fw={600} c="brand.7">
                VN-PT-0221
              </Text>
            </Group>
            <Group gap={8}>
              <IconMapPin size={18} color="#388E3C" />
              <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                Vùng:
              </Text>
              <Text size="sm" fw={600} c="brand.7">
                Vùng Tây nguyên
              </Text>
            </Group>
            <Group gap={8}>
              <IconMapPin size={18} color="#388E3C" />
              <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                Khu vực:
              </Text>
              <Text size="sm" fw={600} c="brand.7">
                Khu vực A
              </Text>
            </Group>
            <Group gap={8}>
              <IconMapPin size={18} color="#388E3C" />
              <Text size="sm" c="gray.6" fw={500} style={{ minWidth: 140 }}>
                Lô:
              </Text>
              <Text size="sm" fw={600} c="brand.7">
                Lô 05
              </Text>
            </Group>
          </Stack>
          <Group grow mt="md">
            <Button radius={4} variant="outline" color="brand">
              Tìm kiếm
            </Button>
            <Button
              radius={4}
              color="brand"
              onClick={() => setOpenDrawer(true)}
            >
              Lọc
            </Button>
          </Group>
        </Stack>
      </Paper>

      <Drawer
        offset={8}
        size={"xl"}
        radius="md"
        opened={openDrawer}
        onClose={() => setOpenDrawer(false)}
        title={<Text fw={"bold"}>Tìm kiếm vùng</Text>}
        position="right"
        styles={{
          overlay: {
            zIndex: 99999,
          },
          inner: {
            zIndex: 99999,
          },
        }}
      >
        <Stack gap={"xs"}>
          <CompanyList />
          <Select
            searchable
            radius={4}
            label="Mã vùng ( định danh nhà nước )"
            data={["VN-PT-0123", "VN-03-033"]}
            styles={{
              dropdown: {
                zIndex: 99999,
              },
            }}
          />

          <TextInput
            label="Khu vực"
            placeholder="Tìm kiếm khu vực"
            radius={4}
            leftSection={<IconSearch size={18} />}
          />
          <AreaCards areas={areaOptions} selected={""} onSelect={() => {}} />
          <TextInput
            radius={4}
            label="Lô"
            placeholder="Tìm kiếm lô"
            leftSection={<IconMapPin size={16} />}
          />

          <PlotCardSelector lots={plotOptions} />
          <Button
            radius={4}
            variant="outline"
            leftSection={<IconSearch size={18} />}
          >
            Tìm kiếm
          </Button>
        </Stack>
      </Drawer>
    </Stack>
  );
};
export default MapManagementMapPage;
