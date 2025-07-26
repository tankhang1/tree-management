import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  Modal,
  Text,
  Radio,
  MultiSelect,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";

// Dummy data để hiển thị trong Select
const pesticideOptions = [
  { value: "TYPE01", label: "Thuốc trừ sâu" },
  { value: "TYPE02", label: "Thuốc trừ bệnh" },
  { value: "TYPE03", label: "Phân bón lá" },
];

type FormValues = {
  id: string;
  pesticideId: string;
  fieldId: string;
  startTime: Date;
  endTime: Date;
  staffId: string;
  reason: string;
  amount: number;
  description: string;
};

const AddPesticideUsageForm = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group");
  const form = useForm<FormValues>({
    initialValues: {
      id: "",
      pesticideId: "",
      fieldId: "",
      startTime: new Date(),
      endTime: new Date(),
      staffId: "",
      reason: "",
      amount: 0,
      description: "",
    },
    validate: {
      id: (v) => (!v ? "Mã phiếu không được để trống" : null),
      pesticideId: (v) => (!v ? "Chọn loại thuốc" : null),
      fieldId: (v) => (!v ? "Chọn vùng" : null),
      staffId: (v) => (!v ? "Chọn nhân viên" : null),
      reason: (v) => (!v ? "Nhập lý do sử dụng" : null),
      amount: (v) => (v <= 0 ? "Số lượng phải lớn hơn 0" : null),
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Phiếu sử dụng thuốc:", values);
    // TODO: Gửi dữ liệu lên backend hoặc cập nhật store
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã phiếu"
          placeholder="PU001"
          radius={4}
          {...form.getInputProps("id")}
        />

        <Select
          searchable
          label="Loại thuốc"
          placeholder="Chọn loại thuốc"
          data={pesticideOptions}
          radius={4}
          {...form.getInputProps("pesticideId")}
        />

        <Group grow>
          <DateTimePicker
            label="Thời gian bắt đầu"
            radius={4}
            {...form.getInputProps("startTime")}
          />
          <DateTimePicker
            label="Thời gian kết thúc"
            radius={4}
            {...form.getInputProps("endTime")}
          />
        </Group>

        <Group>
          <Text fw={"500"} fz={14}>
            Chọn nhân sự thực hiện
          </Text>
          <Button
            variant="light"
            radius={4}
            leftSection={<IconFilter size={18} />}
            onClick={openFilterEmployee}
          >
            Lọc nhân sự
          </Button>
        </Group>
        <TextInput
          label="Lý do sử dụng"
          radius={4}
          placeholder="Ví dụ: Phòng trừ sâu cuốn lá"
          {...form.getInputProps("reason")}
        />

        <NumberInput
          label="Số lượng (ml)"
          radius={4}
          placeholder="Nhập số lượng"
          min={1}
          {...form.getInputProps("amount")}
        />

        <Textarea
          label="Mô tả chi tiết"
          radius={4}
          placeholder="Ghi chú thêm về phương pháp hoặc tình trạng cây trồng..."
          autosize
          minRows={3}
          {...form.getInputProps("description")}
        />

        <Group justify="flex-end" mt="md">
          <Button radius={4}>Lưu</Button>
        </Group>
      </Stack>
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
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
            radius={4}
          />
          <EmployeeCardList />
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
    </form>
  );
};

export default AddPesticideUsageForm;
