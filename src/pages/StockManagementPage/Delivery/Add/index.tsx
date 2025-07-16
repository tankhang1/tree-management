import {
  Stepper,
  TextInput,
  Button,
  Group,
  Stack,
  Card,
  FileButton,
  Text,
  Title,
  Badge,
  Divider,
  Grid,
  Modal,
  Radio,
  SegmentedControl,
  Select,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { IconArrowLeft, IconCheck, IconDownload } from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
type SubArea = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  areaSize: number;
};

type AreaGroup = {
  parentId: string;
  parentName: string;
  latitude: number;
  longitude: number;
  areaSize: number;
  note: string;
  subAreaCount: number;
  children: SubArea[];
};

type WarehouseItem = {
  group: string;
  name: string;
  quantity: number;
  unit: string;
  packing: string;
};

const areaGroups = [
  {
    parentId: "KV001",
    parentName: "Khu vực A",
    latitude: 10.762622,
    longitude: 106.660172,
    areaSize: 1200,
    note: "Khu vực gần hồ nước",
    subAreaCount: 2,
    children: [
      {
        id: "KV001-1",
        name: "Khu phụ A1",
        latitude: 10.763,
        longitude: 106.661,
        areaSize: 500,
      },
      {
        id: "KV001-2",
        name: "Khu phụ A2",
        latitude: 10.764,
        longitude: 106.662,
        areaSize: 700,
      },
    ],
  },
  {
    parentId: "KV002",
    parentName: "Khu vực B",
    latitude: 10.776889,
    longitude: 106.700806,
    areaSize: 900,
    note: "Không phân chia",
    subAreaCount: 0,
    children: [],
  },
];

export default function StockManagementAddDeliveryPage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [importedItems, setImportedItems] = useState<WarehouseItem[]>([]);
  const [selectedAreaGroup, setSelectedAreaGroup] = useState<AreaGroup | null>(
    null
  );
  const [selectedSubArea, setSelectedSubArea] = useState<SubArea | null>(null);
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [inputMode, setInputMode] = useState<"upload" | "manual">("upload");
  const form = useForm<{
    warehouseName: string;
    areaId: string;
    areaDetail: string;
  }>({
    initialValues: {
      warehouseName: "",
      areaId: "",
      areaDetail: "",
    },
  });

  const handleUploadFile = () => {
    setImportedItems([
      {
        group: "Phân bón",
        name: "Phân NPK 16-16-8",
        quantity: 100,
        unit: "bao",
        packing: "25kg/bao",
      },
      {
        group: "BVTV",
        name: "Thuốc trừ sâu",
        quantity: 30,
        unit: "chai",
        packing: "100ml",
      },
      {
        group: "Máy móc",
        name: "Máy xịt thuốc chạy điện",
        quantity: 2,
        unit: "cái",
        packing: "1 bộ/đơn vị",
      },
    ]);
  };

  const handleAreaCardClick = (group: AreaGroup) => {
    setSelectedAreaGroup(group);
    openModal();
  };

  const handleSubAreaSelect = () => {
    if (selectedSubArea) {
      form.setFieldValue("areaId", selectedSubArea.id);
      form.setFieldValue(
        "areaDetail",
        `${selectedAreaGroup?.parentName} - ${selectedSubArea.name}`
      );
      closeModal();
    }
  };

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
        <Title order={3}>Tạo mới kho vận</Title>
      </Group>
      <Stepper
        active={active}
        onStepClick={setActive}
        allowNextStepsSelect={false}
        size="md"
      >
        <Stepper.Step label="Bước 1" description="Xác định vị trí">
          <form onSubmit={form.onSubmit(() => setActive(1))}>
            <Stack gap="xs">
              <Select
                label="Kho"
                data={["Kho A", "Kho B"]}
                radius={4}
                placeholder="Nhập tên kho mới"
                withAsterisk
                {...form.getInputProps("warehouseName")}
              />

              <Title order={5}>Chọn khu vực</Title>
              <Grid>
                {areaGroups.map((group) => (
                  <Grid.Col span={{ base: 12, sm: 6 }} key={group.parentId}>
                    <Card
                      withBorder
                      shadow="xs"
                      radius="md"
                      onClick={() => handleAreaCardClick(group)}
                      style={{
                        cursor: "pointer",
                        borderColor:
                          selectedAreaGroup?.parentId === group.parentId
                            ? "green"
                            : undefined,
                      }}
                    >
                      <Group justify="apart">
                        <Text fw={600}>{group.parentName}</Text>
                        <Badge color="blue">{group.parentId}</Badge>
                      </Group>
                      <Text size="sm" mt={4}>
                        📍 {group.latitude}, {group.longitude}
                      </Text>
                      <Text size="sm">📏 {group.areaSize} m²</Text>
                      <Text size="sm">🔧 {group.subAreaCount} khu phụ</Text>
                      <Text size="sm" color="dimmed">
                        {group.note}
                      </Text>
                    </Card>
                  </Grid.Col>
                ))}
              </Grid>

              <Group justify="right">
                <Button type="submit" radius={4}>
                  Tiếp theo
                </Button>
              </Group>
            </Stack>
          </form>

          <Modal
            opened={modalOpened}
            onClose={closeModal}
            title={`Chọn khu phụ trong ${selectedAreaGroup?.parentName}`}
            centered
          >
            <Radio.Group
              value={selectedSubArea?.id}
              onChange={(val) => {
                const found = selectedAreaGroup?.children.find(
                  (c) => c.id === val
                );
                if (found) {
                  setSelectedSubArea(found);
                }
              }}
            >
              <Stack>
                {selectedAreaGroup?.children.map((child: SubArea) => (
                  <Radio
                    key={child.id}
                    value={child.id}
                    label={
                      <Stack gap={2}>
                        <Text fw={500}>{child.name}</Text>
                        <Text size="sm" color="dimmed">
                          📍 {child.latitude}, {child.longitude}
                        </Text>
                        <Text size="sm">📏 {child.areaSize} m²</Text>
                      </Stack>
                    }
                  />
                ))}
              </Stack>
            </Radio.Group>
            <Group justify="right" mt="md">
              <Button variant="default" onClick={closeModal}>
                Huỷ
              </Button>
              <Button onClick={handleSubAreaSelect} disabled={!selectedSubArea}>
                Xác nhận
              </Button>
            </Group>
          </Modal>
        </Stepper.Step>

        <Stepper.Step label="Bước 2" description="Thông tin vật tư">
          <Stack gap="md">
            <SegmentedControl
              radius={4}
              fullWidth
              value={inputMode}
              onChange={(val) => setInputMode(val as "upload" | "manual")}
              data={[
                { label: "Tải file Excel", value: "upload" },
                { label: "Tạo mới thủ công", value: "manual" },
              ]}
            />

            {inputMode === "upload" && (
              <Stack gap={"xs"}>
                <Group justify="apart">
                  <FileButton onChange={handleUploadFile} accept=".xlsx,.xls">
                    {(props) => (
                      <Button
                        radius={4}
                        {...props}
                        leftSection={<IconDownload size={16} />}
                      >
                        Tải file Excel
                      </Button>
                    )}
                  </FileButton>
                  <Text size="sm" color="dimmed">
                    Chỉ chấp nhận định dạng .xlsx hoặc .xls
                  </Text>
                </Group>
              </Stack>
            )}

            {inputMode === "manual" && (
              <Stack>
                <Select
                  radius={4}
                  label="Loại tài nguyên"
                  placeholder="VD: Phân NPK 16-16-8"
                  data={[
                    "Thuốc bảo vệ thực vật",
                    "Vật tư",
                    "Phân bón",
                    "Máy móc",
                  ]}
                  required
                />

                <TextInput
                  radius={4}
                  label="Nhóm vật tư"
                  placeholder="VD: Phân bón, BVTV, Máy móc"
                  required
                />

                <TextInput
                  radius={4}
                  label="Số lượng"
                  placeholder="VD: 100"
                  type="number"
                  required
                />

                <TextInput
                  radius={4}
                  label="Đơn vị"
                  placeholder="VD: bao, chai, cái"
                  required
                />

                <TextInput
                  radius={4}
                  label="Quy cách đóng gói"
                  placeholder="VD: 25kg/bao, 100ml, 1 bộ/đơn vị"
                />

                <Button
                  radius={4}
                  variant="light"
                  onClick={() => {
                    // Tạm tạo dữ liệu mẫu; bạn nên dùng useForm để lấy giá trị từ input
                    setImportedItems((prev) => [
                      ...prev,
                      {
                        group: "Phân bón",
                        name: "Phân NPK 16-16-8",
                        quantity: 100,
                        unit: "bao",
                        packing: "25kg/bao",
                      },
                    ]);
                  }}
                >
                  Thêm vật tư
                </Button>
              </Stack>
            )}

            <Divider label="Danh sách vật tư" labelPosition="center" my="sm" />

            <Grid gutter="sm">
              {importedItems.map((item, index) => (
                <Grid.Col span={{ base: 12, sm: 6, md: 4 }} key={index}>
                  <Card shadow="sm" radius="md" withBorder>
                    <Group justify="apart" mb="xs">
                      <Text fw={600}>{item.name}</Text>
                      <Badge variant="filled" color="blue" radius="sm">
                        {item.group}
                      </Badge>
                    </Group>
                    <Text size="sm">Số lượng: {item.quantity}</Text>
                    <Text size="sm">Đơn vị: {item.unit}</Text>
                    <Text size="sm">Quy cách: {item.packing}</Text>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>

            <Group justify="space-between">
              <Button radius={4} variant="default" onClick={() => setActive(0)}>
                Quay lại
              </Button>
              <Button radius={4} onClick={() => setActive(2)}>
                Tiếp theo
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Step label="Bước 3" description="Xác nhận">
          <Stack gap="lg">
            <Title order={3}>Thông tin kho</Title>
            <Text>
              <strong>Tên kho:</strong> {form.values.warehouseName}
            </Text>
            <Text>
              <strong>Khu vực đã chọn:</strong> {form.values.areaDetail}
            </Text>
            <Text size="sm" color="dimmed">
              Mã khu phụ: {form.values.areaId}
            </Text>

            <Divider label="Danh sách vật tư" labelPosition="center" my="md" />

            <Group grow>
              {importedItems.map((item, index) => (
                <Card key={index} shadow="xs" radius="md" withBorder>
                  <Group justify="apart" mb="xs">
                    <Text fw={600}>{item.name}</Text>
                    <Badge color="green" variant="light">
                      {item.group}
                    </Badge>
                  </Group>
                  <Stack>
                    <Text size="sm">SL: {item.quantity}</Text>
                    <Text size="sm">Đơn vị: {item.unit}</Text>
                    <Text size="sm">Quy cách: {item.packing}</Text>
                  </Stack>
                </Card>
              ))}
            </Group>

            <Group justify="space-between" mt="lg">
              <Button radius={4} variant="default" onClick={() => setActive(1)}>
                Quay lại
              </Button>
              <Button
                radius={4}
                leftSection={<IconCheck size={18} />}
                color="teal"
                onClick={() => alert("✅ Đã lưu thành công!")}
              >
                Xác nhận và lưu
              </Button>
            </Group>
          </Stack>
        </Stepper.Step>

        <Stepper.Completed>
          <Text>🎉 Tạo kho thành công!</Text>
        </Stepper.Completed>
      </Stepper>
    </Card>
  );
}
