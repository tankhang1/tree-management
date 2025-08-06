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
  Input,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import {
  IconFilter,
  IconPhoto,
  IconSearch,
  IconUpload,
  IconX,
} from "@tabler/icons-react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";
import { useState } from "react";
import { useDisclosure } from "@mantine/hooks";
import { Dropzone } from "@mantine/dropzone";

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
        <Group grow>
          <NumberInput
            label="Số lượng"
            radius={4}
            placeholder="Nhập số lượng"
            min={1}
            {...form.getInputProps("amount")}
          />

          {/* <Select label="Đơn vị" radius={4} placeholder="Đơn vị" /> */}
          <MultiSelect
            label="Quy cách"
            radius={4}
            placeholder="Quy cách"
            data={[
              { value: "PKG001", label: "Hộp giấy nhỏ (50 cái)" },
              { value: "PKG002", label: "Túi nilon lớn (100 cái)" },
              { value: "PKG003", label: "Bao tải 25kg (25 cái)" },
              { value: "PKG004", label: "Bịch nhựa 1kg (10 cái)" },
              { value: "PKG005", label: "Thùng carton lớn (20 cái)" },
              { value: "PKG006", label: "Hộp nhựa 500ml (30 cái)" },
            ]}
          />
        </Group>
        <Select
          label="Lý do huỷ"
          placeholder="Chọn lý do"
          data={disposalReasons}
          withAsterisk
          radius={4}
          {...form.getInputProps("reason")}
        />

        <Textarea
          label="Mô tả chi tiết"
          placeholder="Mô tả chi tiết"
          radius={4}
          autosize
          minRows={2}
          {...form.getInputProps("notes")}
        />
        <Input.Wrapper label="Chứng từ liên quan">
          <Dropzone
            onDrop={(files) => console.log("accepted files", files)}
            onReject={(files) => console.log("rejected files", files)}
            maxSize={5 * 1024 ** 2}
            accept={["application/pdf"]}
          >
            <Group
              justify="center"
              gap="xl"
              mih={220}
              style={{ pointerEvents: "none" }}
            >
              <Dropzone.Accept>
                <IconUpload
                  size={52}
                  color="var(--mantine-color-blue-6)"
                  stroke={1.5}
                />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX
                  size={52}
                  color="var(--mantine-color-red-6)"
                  stroke={1.5}
                />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto
                  size={52}
                  color="var(--mantine-color-dimmed)"
                  stroke={1.5}
                />
              </Dropzone.Idle>

              <div>
                <Text size="xl" inline>
                  Bỏ và thả file tại đây
                </Text>
                <Text size="sm" c="dimmed" inline mt={7}>
                  Đính kèm file (tối đa 5MB)
                </Text>
              </div>
            </Group>
          </Dropzone>
        </Input.Wrapper>
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
            <Radio value="group" label="Đội nhóm" />
            <Radio value="dept" label="Phòng ban và vai trò" />
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
          <EmployeeCardList isMultiple />
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
