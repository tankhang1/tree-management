import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  NumberInput,
  Select,
  Text,
  Modal,
  Radio,
  MultiSelect,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";

// Danh sách phân bón (giả lập)
const fertilizerOptions = [
  { value: "FER001", label: "Phân NPK 16-16-8" },
  { value: "FER002", label: "Phân DAP" },
  { value: "FER003", label: "Phân hữu cơ vi sinh" },
];

// Lý do huỷ phân bón
const disposalReasons = [
  { value: "expired", label: "Hết hạn sử dụng" },
  { value: "clumped", label: "Vón cục, mất chất" },
  { value: "moisture_damage", label: "Bị ẩm, mốc" },
  { value: "damaged_packaging", label: "Rách bao bì, rò rỉ" },
  { value: "other", label: "Lý do khác" },
];

const AddDisposalForm = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);

  const [mode, setMode] = useState<"group" | "dept">("group");

  const form = useForm({
    initialValues: {
      id: "",
      fertilizerId: "",
      disposalDate: new Date(),
      staffId: "",
      reason: "",
      quantity: 0,
      notes: "",
    },
    validate: {
      id: (v) => (!v ? "Vui lòng nhập mã phiếu" : null),
      fertilizerId: (v) => (!v ? "Chọn phân bón cần huỷ" : null),
      staffId: (v) => (!v ? "Chọn người thực hiện" : null),
      reason: (v) => (!v ? "Vui lòng chọn lý do huỷ" : null),
      quantity: (v) => (v <= 0 ? "Số lượng phải lớn hơn 0" : null),
    },
  });

  const handleSubmit = (values: typeof form.values) => {
    console.log("Phiếu huỷ phân bón:", values);
    // TODO: gửi đến backend
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã phiếu huỷ"
          placeholder="VD: FDIS005"
          withAsterisk
          radius={4}
          {...form.getInputProps("id")}
        />

        <Select
          label="Phân bón cần huỷ"
          placeholder="Chọn loại phân bón"
          data={fertilizerOptions}
          withAsterisk
          radius={4}
          {...form.getInputProps("fertilizerId")}
        />

        <DateTimePicker
          label="Ngày huỷ"
          withAsterisk
          radius={4}
          {...form.getInputProps("disposalDate")}
        />

        <Group>
          <Text fw={500} fz={14}>
            Nhân sự thực hiện
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

        <Select
          label="Lý do huỷ"
          placeholder="Chọn lý do"
          data={disposalReasons}
          withAsterisk
          radius={4}
          {...form.getInputProps("reason")}
        />

        <NumberInput
          label="Số lượng huỷ"
          placeholder="Nhập số lượng (bao/kg)"
          withAsterisk
          min={1}
          radius={4}
          {...form.getInputProps("quantity")}
        />

        <Textarea
          label="Ghi chú"
          placeholder="Ghi chú thêm (nếu có)"
          radius={4}
          autosize
          minRows={2}
          {...form.getInputProps("notes")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit" radius={4}>
            Lưu phiếu
          </Button>
        </Group>
      </Stack>

      {/* Modal lọc nhân sự */}
      <Modal
        opened={openedFilterEmployee}
        onClose={closeFilterEmployee}
        title={<Text fw={700}>Lọc nhân sự</Text>}
      >
        <Stack gap="xs">
          <Radio.Group
            label="Phương thức lọc"
            value={mode}
            onChange={(val) => setMode(val as "group" | "dept")}
          >
            <Radio value="group" label="Theo đội nhóm" />
            <Radio value="dept" label="Theo phòng ban và vai trò" />
          </Radio.Group>

          {mode === "group" && (
            <MultiSelect
              label="Đội nhóm"
              data={["Nhóm kỹ thuật", "Nhóm kho vật tư"]}
              radius={4}
            />
          )}

          {mode === "dept" && (
            <>
              <TextInput
                label="Phòng ban"
                placeholder="Tìm kiếm phòng ban"
                leftSection={<IconSearch size={16} />}
                radius={4}
              />
              <DepartmentCardList />
              <MultiSelect
                label="Vai trò"
                data={["Thủ kho", "Giám sát", "Tổ trưởng"]}
                radius={4}
              />
            </>
          )}

          <TextInput
            label="Tìm kiếm nhân viên"
            placeholder="Chọn nhân sự"
            leftSection={<IconSearch size={16} />}
            radius={4}
          />
          <EmployeeCardList />
        </Stack>

        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            color="red"
            radius={4}
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

export default AddDisposalForm;
