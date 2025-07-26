import {
  Button,
  Group,
  Stack,
  TextInput,
  Textarea,
  Select,
  Text,
  Modal,
  Radio,
  MultiSelect,
} from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { IconFilter, IconSearch } from "@tabler/icons-react";
import { useState } from "react";
import { DepartmentCardList } from "../../../HRManagementPage/Team/Add/components/DepartmentCardList";
import { EmployeeCardList } from "../../../HRManagementPage/Team/Add/components/EmployeeCardList";

// Dữ liệu mẫu – có thể thay bằng API hoặc context
const fertilizerOptions = [
  { value: "FER001", label: "Phân bón lá" },
  { value: "FER002", label: "Phân NPK" },
  { value: "FER003", label: "Phân hữu cơ vi sinh" },
];

type FormValues = {
  id: string;
  fertilizerId: string;
  startTime: Date;
  endTime: Date;
  usedBy: string;
  purpose: string;
  location: string;
};

const AddFertilizerUsageForm = () => {
  const [
    openedFilterEmployee,
    { open: openFilterEmployee, close: closeFilterEmployee },
  ] = useDisclosure(false);
  const [mode, setMode] = useState<"group" | "dept">("group");
  const form = useForm<FormValues>({
    initialValues: {
      id: "",
      fertilizerId: "",
      startTime: new Date(),
      endTime: new Date(),
      usedBy: "",
      purpose: "",
      location: "",
    },
    validate: {
      id: (v) => (!v ? "Mã phiếu không được để trống" : null),
      fertilizerId: (v) => (!v ? "Vui lòng chọn phân bón" : null),
      usedBy: (v) => (!v ? "Chọn người sử dụng" : null),
      purpose: (v) => (!v ? "Nhập mục đích sử dụng" : null),
      location: (v) => (!v ? "Nhập vị trí sử dụng" : null),
    },
  });

  const handleSubmit = (values: FormValues) => {
    console.log("Phiếu sử dụng phân bón:", values);
    // TODO: gửi dữ liệu lên backend hoặc cập nhật store
    form.reset();
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack>
        <TextInput
          label="Mã phiếu"
          placeholder="VD: FERUSE004"
          {...form.getInputProps("id")}
          radius={4}
        />

        <Select
          label="Loại phân bón"
          placeholder="Chọn phân bón"
          data={fertilizerOptions}
          radius={4}
          {...form.getInputProps("fertilizerId")}
        />

        <Group grow>
          <DateTimePicker
            label="Thời gian bắt đầu"
            radius={4}
            {...form.getInputProps("startTime")}
          />
          <DateTimePicker
            label="Thời gian kết thúc"
            {...form.getInputProps("endTime")}
            radius={4}
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
          label="Mục đích sử dụng"
          placeholder="Ví dụ: Bón lót, bón thúc, bón phân vi sinh..."
          {...form.getInputProps("purpose")}
          radius={4}
        />

        <Textarea
          label="Vị trí sử dụng"
          placeholder="Ví dụ: Vùng trồng B2, Lô 3 hàng 7, Khu đất 4..."
          autosize
          minRows={2}
          radius={4}
          {...form.getInputProps("location")}
        />

        <Group justify="flex-end" mt="md">
          <Button type="submit">Lưu</Button>
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

export default AddFertilizerUsageForm;
