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
  NumberInput,
  ActionIcon,
  Stepper,
  Text,
  Modal,
  Radio,
  Image,
} from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconArrowLeft,
  IconPlus,
  IconSearch,
  IconUser,
} from "@tabler/icons-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ConfirmStep from "./components/ConfirmStep";
import { useDisclosure } from "@mantine/hooks";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";

const PlanManagementUnplannedAddPage = () => {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group");
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

  const [newResource, setNewResource] = useState({
    type: "Vật tư",
    name: "",
    quantity: 1,
    unit: "",
  });

  const handleAddResource = () => {
    if (!newResource.name || newResource.quantity <= 0) return;
    //@ts-expect-error no check
    form.setFieldValue("resources", [...form.values.resources, newResource]);
    setNewResource({ type: "Vật tư", name: "", quantity: 1, unit: "" });
  };

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
              label="Mùa vụ"
              placeholder="Chọn mùa vụ cụ thể"
              data={["Mùa Xuân 2025", "Mùa Hè 2025"]}
              required
              radius={4}
              {...form.getInputProps("season")}
            />

            <Select
              label="Chu kỳ sinh trưởng"
              placeholder="Chọn chu kỳ"
              data={["Chu kỳ 1", "Chu kỳ 2"]}
              required
              radius={4}
              {...form.getInputProps("cycle")}
            />

            <Select
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
              label="Tài sản sử dụng (tùy chọn)"
              labelPosition="left"
              my="sm"
            />

            <Group align="flex-end">
              <Select
                label="Loại tài sản"
                radius={4}
                data={["Vật tư", "Thuốc BVTV", "Thiết bị"]}
                value={newResource.type}
                onChange={(value) =>
                  setNewResource({ ...newResource, type: value || "Vật tư" })
                }
                flex={1}
              />
              <TextInput
                label="Tên"
                placeholder="Tên tài sản"
                radius={4}
                value={newResource.name}
                onChange={(e) =>
                  setNewResource({
                    ...newResource,
                    name: e.currentTarget.value,
                  })
                }
                flex={1}
              />
              <NumberInput
                label="Số lượng"
                min={1}
                radius={4}
                flex={1}
                value={newResource.quantity}
                onChange={(value) =>
                  setNewResource({ ...newResource, quantity: +value || 1 })
                }
              />
              <MultiSelect
                label="Quy cách"
                radius={4}
                placeholder="Quy cách"
                data={[
                  {
                    value: "PKG001",
                    label: "Hộp giấy nhỏ (50 cái)",
                  },
                  {
                    value: "PKG002",
                    label: "Túi nilon lớn (100 cái)",
                  },
                  {
                    value: "PKG003",
                    label: "Bao tải 25kg (25 cái)",
                  },
                  {
                    value: "PKG004",
                    label: "Bịch nhựa 1kg (10 cái)",
                  },
                  {
                    value: "PKG005",
                    label: "Thùng carton lớn (20 cái)",
                  },
                  {
                    value: "PKG006",
                    label: "Hộp nhựa 500ml (30 cái)",
                  },
                ]}
              />
              <ActionIcon radius={4} w={30} h={30} onClick={handleAddResource}>
                <IconPlus />
              </ActionIcon>
            </Group>

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
    </Card>
  );
};

export default PlanManagementUnplannedAddPage;
