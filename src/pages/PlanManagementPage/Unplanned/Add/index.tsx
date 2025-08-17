import {
  Button,
  Card,
  Divider,
  Group,
  Select,
  Stack,
  TextInput,
  Title,
  MultiSelect,
  Stepper,
  Text,
  Modal,
  Radio,
  Image,
  Checkbox,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconSearch,
  IconTruck,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmStep from "./components/ConfirmStep";
import { useDisclosure } from "@mantine/hooks";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import Scrollable from "../../../../components/Scrollable";
import Section from "./components/Section";
import { materialList } from "../../../ProductManagementPage/Item/Add";
type Item = {
  id: string;
  name: string;
  img?: string;
  unit?: string; // "cái", "chai", "kg", ...
  code?: string;
  inStock?: number; // tồn kho hiện tại
  minStock?: number; // ngưỡng cảnh báo
  brand?: string;
  origin?: string;
  updatedAt?: string; // ISO
  price?: number; // optional
};

const machineTypes: Item[] = [
  {
    id: "MCH01",
    name: "Máy cày Kubota L3218",
    img: "https://kubotadailoi.com/uploads/images/P-1176_L3218_slide.jpg",
    unit: "cái",
    code: "KUB-L3218",
    inStock: 3,
    minStock: 2,
    brand: "Kubota",
    origin: "Nhật Bản",
    updatedAt: "2025-08-08",
    price: 185_000_000,
  },
  {
    id: "MCH04",
    name: "Máy bay nông nghiệp DJI Agras",
    img: "https://agridrone.vn/wp-content/uploads/2023/02/16887_T50_%E6%AD%A3%E4%BE%A7.jpg",
    unit: "cái",
    code: "DJI-AG-T50",
    inStock: 1,
    minStock: 1,
    brand: "DJI",
    origin: "Trung Quốc",
    updatedAt: "2025-08-06",
    price: 330_000_000,
  },
];

const supplies: Item[] = [
  {
    id: "SUP01",
    name: "Béc tưới nhỏ giọt 8L/h",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXj6nfv7JlBEuVoQo0o9DUUXGAnLXXec-JLg&s",
    unit: "cái",
    code: "IRR-DRIP-8L",
    inStock: 1200,
    minStock: 300,
    brand: "Netafim",
    origin: "Israel",
    updatedAt: "2025-08-07",
    price: 3500,
  },
  {
    id: "SUP02",
    name: "Ống HDPE Φ16",
    img: "https://bizweb.dktcdn.net/thumb/1024x1024/100/348/321/products/ong-hdpe-wata-20.jpg?v=1669780765193",
    unit: "m",
    code: "PIPE16",
    inStock: 800,
    minStock: 200,
    brand: "Danko",
    origin: "Việt Nam",
    updatedAt: "2025-08-05",
    price: 6000,
  },
];

const pesticides: Item[] = [
  {
    id: "PES01",
    name: "Thuốc trừ sâu Emamectin 5%",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRV9s4k_p9Y4CZNPLFlRhbQPc4GZZvVNSoGVg&s",
    unit: "chai",
    code: "EMA-5",
    inStock: 40,
    minStock: 20,
    brand: "Syngenta",
    origin: "Thụy Sĩ",
    updatedAt: "2025-08-09",
    price: 145000,
  },
  {
    id: "PES02",
    name: "Thuốc trừ nấm Mancozeb 80WP",
    img: "https://nongduochai.vn/images/products/2021/04/13/original/manozeb-80wp_xanh_1kg_1618288208.png",
    unit: "gói",
    code: "MAN-80",
    inStock: 8,
    minStock: 10,
    brand: "UPL",
    origin: "Ấn Độ",
    updatedAt: "2025-08-02",
    price: 38000,
  },
];

const PlanManagementUnplannedAddPage = () => {
  const navigate = useNavigate();
  const [selectedDevice, setSelectedDevice] = useState<number[]>([]);
  const [active, setActive] = useState(0);
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group");
  const [openedAddForm, setOpenedAddForm] = useState(false);
  const [openedAddMaterialForm, setOpenedAddMaterialForm] = useState(false);
  const [openedAddPesticideForm, setOpenedAddPesticideForm] = useState(false);
  const form = useForm({
    initialValues: {
      name: "",
      startDate: new Date(),
      endDate: new Date(),
      season: "",
      cycle: "",
      stage: "",
      departments: [],
      employees: [],
      creator: "Nguyễn Quản Lý",
      supervisor: "",
      resources: [],
    },
  });

  const nextStep = () => setActive((current) => Math.min(current + 1, 3));
  const prevStep = () => setActive((current) => Math.max(current - 1, 0));

  return (
    <Card withBorder shadow="sm" radius={8} p="xl">
      <Group mb="md">
        <Button
          variant="subtle"
          radius={4}
          leftSection={<IconArrowLeft size={18} />}
          onClick={() => navigate(-1)}
        >
          Quay lại
        </Button>
        <Title order={3}>Tạo công việc phát sinh</Title>
      </Group>

      <form onSubmit={form.onSubmit((values) => console.log(values))}>
        <Stepper active={active} onStepClick={setActive} mb="xl">
          <Stepper.Step label="Bước 1" description="Thông tin chung" />
          <Stepper.Step label="Bước 2" description="Tài sản" />
          <Stepper.Step label="Bước 3" description="Xác nhận" />
          <Stepper.Completed>
            <Stack align="center" justify="center" mt="xl">
              <Image
                src={
                  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQjPNbBpZeXnXfTuA6AWek-Kj8NYEVbYdG6ayi5bIWarDuryXDrILdKMTd597quLD0PBKM&usqp=CAU"
                }
                w={200}
                fit="cover"
              />
              <Text fz={"h2"} ta="center">
                Thêm mới công việc phát sinh thành công!
              </Text>
              <Text fz={"md"} ta="center" c="dimmed">
                Công việc phát sinh mới đã được tạo thành công. Bạn có thể xem
                lại thông tin chi tiết trong danh sách công việc phát sinh.
              </Text>

              <Button size="md" mt="md" radius={4} onClick={() => navigate(-1)}>
                Xác nhận
              </Button>
            </Stack>
          </Stepper.Completed>
        </Stepper>

        {active === 0 && (
          <Stack gap={"xs"}>
            <TextInput
              label="Tên công việc"
              placeholder="Ví dụ: Phun thuốc sâu vụ hè"
              radius={4}
              required
              {...form.getInputProps("name")}
            />

            <Group grow>
              <DateInput
                label="Thời gian thực hiện dự kiến"
                placeholder="Chọn ngày"
                radius={4}
                locale="vi"
                {...form.getInputProps("startDate")}
              />
              <DateInput
                label="Thời gian hoàn thành dự kiến"
                placeholder="Chọn ngày"
                radius={4}
                locale="vi"
                {...form.getInputProps("endDate")}
              />
            </Group>

            <Select
              searchable
              clearable
              label="Mùa vụ"
              placeholder="Chọn mùa vụ cụ thể"
              data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
              required
              radius={4}
              {...form.getInputProps("season")}
            />

            <Select
              searchable
              clearable
              label="Chu kỳ sinh trưởng"
              placeholder="Chọn chu kỳ"
              data={["Chu kỳ 1", "Chu kỳ 2"]}
              required
              radius={4}
              {...form.getInputProps("cycle")}
            />

            <Select
              searchable
              clearable
              label="Giai đoạn sinh trưởng"
              placeholder="Chọn giai đoạn"
              data={["Gieo trồng", "Ra hoa", "Kết trái"]}
              required
              radius={4}
              {...form.getInputProps("stage")}
            />

            <Stack gap={"xs"}>
              <Group>
                <Text fw={"500"} fz={15}>
                  Nhân sự
                </Text>
                <Button
                  variant="light"
                  radius={4}
                  onClick={openFilterEmployee}
                  leftSection={<IconUser size={18} />}
                >
                  Chọn nhân sự
                </Button>
              </Group>
              <EmployeeCardList isDelete={true} />
            </Stack>
            <Stack gap={"xs"}>
              <Group>
                <Text fw={"500"} fz={15}>
                  Người kiểm định chất lượng
                </Text>
                <Button
                  variant="light"
                  radius={4}
                  onClick={openFilterEmployee}
                  leftSection={<IconUser size={18} />}
                >
                  Chọn người kiểm định chất lượng
                </Button>
              </Group>
              <EmployeeCardList isDelete={true} />
            </Stack>
          </Stack>
        )}

        {active === 1 && (
          <Stack>
            <Divider
              label="Hạng mục sử dụng (tùy chọn)"
              labelPosition="left"
              my="sm"
            />
            <Section
              title="Máy móc"
              data={machineTypes}
              onAdd={() => setOpenedAddForm(true)}
              onDelete={(id) => console.log("delete", id)}
            />

            <Section
              title="Vật tư"
              data={supplies}
              onAdd={() => setOpenedAddMaterialForm(true)}
              onDelete={(id) => console.log("delete", id)}
            />

            <Section
              title="Thuốc bảo vệ thực vật"
              data={pesticides}
              onAdd={() => setOpenedAddPesticideForm(true)}
              onDelete={(id) => console.log("delete", id)}
            />
            {form.values.resources.length > 0 && (
              <Stack gap="xs">
                {form.values.resources.map((r, i) => (
                  <Group key={i} justify="space-between" pl="md">
                    <Text>{r.type}</Text>
                    <Text>{r.name}</Text>
                    <Text>
                      {r.quantity} {r.unit || ""}
                    </Text>
                  </Group>
                ))}
              </Stack>
            )}
          </Stack>
        )}
        {active === 2 && <ConfirmStep />}
        {active < 3 && (
          <Group justify="space-between" mt="lg">
            <Button
              radius={4}
              onClick={prevStep}
              disabled={active === 0}
              variant="default"
            >
              Quay lại
            </Button>
            {active < 2 ? (
              <Button radius={4} onClick={nextStep}>
                Tiếp tục
              </Button>
            ) : (
              <Button radius={4} onClick={nextStep}>
                Hoàn thành
              </Button>
            )}
          </Group>
        )}
      </form>
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        size={"lg"}
        title={<Text fw={"bold"}>Lọc nhân sự</Text>}
      >
        <Stack gap={"xs"}>
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" mb={"xs"} label="Chọn theo đội nhóm" />
            <Radio value="dept" label="Chọn theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Chọn đội nhóm"
              radius={4}
              data={["Nhóm Canh tác", "Nhóm Vật tư"]}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban liên quan"
                {...form.getInputProps("departments")}
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Chọn vai trò"
                radius={4}
                data={["Giám đốc", "Tổ trưởng", "Trưởng phòng"]}
              />
            </>
          )}
          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn thành viên từ nhân sự"
            leftSection={<IconSearch size={16} />}
            {...form.getInputProps("members")}
            radius={4}
          />
          <EmployeeCardList isMultiple />
        </Stack>

        <Group mt="md" justify="flex-end">
          <Button
            radius={4}
            variant="outline"
            color="red"
            onClick={closeFilterEmployee}
          >
            Huỷ
          </Button>
          <Button radius={4}>Xác nhận</Button>
        </Group>
      </Modal>
      <Modal
        opened={openedAddForm}
        onClose={() => setOpenedAddForm(false)}
        title={<Text fw={"bold"}>Thêm máy móc</Text>}
        size={"lg"}
      >
        <Stack gap={"xs"}>
          <Select
            searchable
            clearable
            radius={4}
            label="Loại máy móc thiết bị"
            placeholder="Tìm kiếm loại máy móc thiết bị"
            leftSection={<IconTruck size={18} />}
            data={[
              { value: "MCH01", label: "Máy cày Kubota" },
              { value: "MCH02", label: "Máy phun thuốc Honda" },
              {
                value: "MCH03",
                label: "Máy gặt đập liên hợp Yanmar",
              },
              {
                value: "MCH04",
                label: "Máy bay nông nghiệp DJI Agras",
              },
              {
                value: "MCH05",
                label: "Máy bơm nước Honda WB20XT",
              },
              { value: "MCH06", label: "Máy trộn bê tông 250L" },
            ]}
          />
          <TextInput
            label="Máy móc thiết bị"
            placeholder="Tìm kiếm máy móc thiết bị"
            radius={4}
            leftSection={<IconSearch size={18} />}
          />
          <Scrollable h={130}>
            <Group gap="md" wrap="nowrap" p={"xs"}>
              {machineTypes.map((machine, index) => (
                <Card
                  key={index}
                  withBorder
                  miw={400}
                  shadow="sm"
                  radius={4}
                  p="md"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 0.2s ease",
                    borderColor: selectedDevice.includes(index)
                      ? "green"
                      : undefined,
                  }}
                  onClick={() => {
                    setSelectedDevice((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index]
                    );
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Group grow>
                    <Image
                      src={
                        machine?.img || "https://via.placeholder.com/150" // Placeholder nếu không có hình ảnh
                      }
                      alt={machine.name}
                      w={100}
                      h={100}
                      radius={4}
                    />
                    <Stack>
                      <Text fw={500} size="lg">
                        {machine.name}
                      </Text>
                      <Group>
                        <Text size="sm" color="dimmed">
                          Mã: {machine.id}
                        </Text>
                        <Checkbox
                          radius={4}
                          onChange={() => {}}
                          checked={selectedDevice.includes(index)}
                          readOnly
                        />
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Group>
          </Scrollable>
          <Group justify="flex-end" mt="md">
            <Button radius={4}>Xác nhận</Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        opened={openedAddMaterialForm}
        onClose={() => setOpenedAddMaterialForm(false)}
        title={<Text fw={"bold"}>Thêm mới vật tư</Text>}
        size={"lg"}
      >
        <Stack gap={"xs"}>
          <Select
            searchable
            clearable
            label="Loại vật tư"
            placeholder="Tìm kiếm loại vật tư"
            radius={4}
            leftSection={<IconSearch size={18} />}
            data={[
              { value: "MAT01", label: "Cát" },
              { value: "MAT02", label: "Xi măng" },
              { value: "MAT03", label: "Đá" },
              { value: "MAT04", label: "Sắt" },
              { value: "MAT05", label: "Gạch" },
              { value: "MAT06", label: "Ngói" },
            ]}
          />
          <TextInput
            label="Vật tư"
            placeholder="Tìm kiếm vật tư"
            radius={4}
            leftSection={<IconSearch size={18} />}
          />
          <Scrollable h={130}>
            <Group gap="md" wrap="nowrap" p={"xs"}>
              {materialList.map((material, index) => (
                <Card
                  key={index}
                  withBorder
                  miw={400}
                  shadow="sm"
                  radius={4}
                  p="md"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 0.2s ease",
                    borderColor: selectedDevice.includes(index)
                      ? "green"
                      : undefined,
                  }}
                  onClick={() => {
                    setSelectedDevice((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index]
                    );
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Group grow>
                    <Image
                      src={
                        material?.img || "https://via.placeholder.com/150" // Placeholder nếu không có hình ảnh
                      }
                      alt={material.materialName}
                      w={100}
                      h={100}
                      radius={4}
                    />
                    <Stack>
                      <Text fw={500} size="lg">
                        {material.materialName}
                      </Text>
                      <Group>
                        <Text size="sm" color="dimmed">
                          Mã: {material.materialCode}
                        </Text>
                        <Checkbox
                          radius={4}
                          onChange={() => {}}
                          checked={selectedDevice.includes(index)}
                          readOnly
                        />
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Group>
          </Scrollable>
          <Group justify="flex-end" mt="md">
            <Button radius={4}>Xác nhận</Button>
          </Group>
        </Stack>
      </Modal>
      <Modal
        opened={openedAddPesticideForm}
        onClose={() => setOpenedAddPesticideForm(false)}
        title={<Text fw={"bold"}>Thêm mới thuốc trừ sâu</Text>}
        size={"lg"}
      >
        <Stack gap={"xs"}>
          <Select
            searchable
            clearable
            label="Loại thuốc trừ sâu"
            placeholder="Tìm kiếm loại thuốc trừ sâu"
            radius={4}
            leftSection={<IconSearch size={18} />}
            data={[
              { value: "PEST01", label: "Thuốc trừ sâu A" },
              { value: "PEST02", label: "Thuốc trừ sâu B" },
              { value: "PEST03", label: "Thuốc trừ sâu C" },
              { value: "PEST04", label: "Thuốc trừ sâu D" },
              { value: "PEST05", label: "Thuốc trừ sâu E" },
              { value: "PEST06", label: "Thuốc trừ sâu F" },
            ]}
          />
          <TextInput
            label="Thuốc trừ sâu"
            placeholder="Nhập tên thuốc trừ sâu"
            radius={4}
            leftSection={<IconSearch size={18} />}
          />
          <Scrollable h={130}>
            <Group gap="md" wrap="nowrap" p={"xs"}>
              {pesticides.map((pesticide, index) => (
                <Card
                  key={index}
                  withBorder
                  miw={400}
                  shadow="sm"
                  radius={4}
                  p="md"
                  style={{
                    cursor: "pointer",
                    position: "relative",
                    transition: "transform 0.2s ease",
                    borderColor: selectedDevice.includes(index)
                      ? "green"
                      : undefined,
                  }}
                  onClick={() => {
                    setSelectedDevice((prev) =>
                      prev.includes(index)
                        ? prev.filter((i) => i !== index)
                        : [...prev, index]
                    );
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.transform = "scale(1.02)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.transform = "scale(1)")
                  }
                >
                  <Group grow>
                    <Image
                      src={
                        pesticide?.img || "https://via.placeholder.com/150" // Placeholder nếu không có hình ảnh
                      }
                      alt={pesticide.name}
                      w={100}
                      h={100}
                      radius={4}
                    />
                    <Stack>
                      <Text fw={500} size="lg">
                        {pesticide.name}
                      </Text>
                      <Group>
                        <Text size="sm" color="dimmed">
                          Mã: {pesticide.code}
                        </Text>
                        <Checkbox
                          radius={4}
                          onChange={() => {}}
                          checked={selectedDevice.includes(index)}
                          readOnly
                        />
                      </Group>
                    </Stack>
                  </Group>
                </Card>
              ))}
            </Group>
          </Scrollable>
          <Group justify="flex-end" mt="md">
            <Button radius={4}>Xác nhận</Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
};

export default PlanManagementUnplannedAddPage;
