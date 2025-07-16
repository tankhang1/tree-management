import {
  Button,
  Group,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from "@mantine/core";
import { DatePickerInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconUser } from "@tabler/icons-react";
type TCreateBatmanTaskForm = {
  onFilter: () => void;
};
const CreateBatmanTaskForm = ({ onFilter }: TCreateBatmanTaskForm) => {
  const form = useForm({
    initialValues: {
      employee: "",
      taskName: "",
      startDate: null,
      endDate: null,
      status: "",
      reviewer: "",
      note: "",
    },

    validate: {},
  });

  return (
    <form onSubmit={form.onSubmit((values) => console.log(values))}>
      <Stack gap="xs">
        <Group>
          <Text fw={"500"} fz={15}>
            Nhân sự tham gia
          </Text>
          <Button
            variant="light"
            radius={4}
            onClick={onFilter}
            leftSection={<IconUser size={18} />}
          >
            Chọn quản lý
          </Button>
        </Group>

        <TextInput
          label="Tên công việc"
          placeholder="Phun thuốc trừ sâu đợt 1"
          {...form.getInputProps("taskName")}
          radius={4}
        />

        <Group grow>
          <DatePickerInput
            label="Ngày bắt đầu"
            placeholder="Chọn ngày"
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps("startDate")}
            radius={4}
          />
          <DatePickerInput
            label="Ngày kết thúc"
            placeholder="Chọn ngày"
            valueFormat="YYYY-MM-DD"
            {...form.getInputProps("endDate")}
            radius={4}
          />
        </Group>

        <Select
          label="Trạng thái"
          placeholder="Chọn trạng thái"
          data={["Chưa bắt đầu", "Đang thực hiện", "Đã hoàn thành"]}
          {...form.getInputProps("status")}
          radius={4}
        />

        <Group>
          <Text fw={"500"} fz={15}>
            Người kiểm duyệt
          </Text>
          <Button
            variant="light"
            radius={4}
            onClick={onFilter}
            leftSection={<IconUser size={18} />}
          >
            Chọn quản lý
          </Button>
        </Group>
        <Textarea
          label="Ghi chú (tuỳ chọn)"
          placeholder="Nhập ghi chú nếu có"
          autosize
          minRows={2}
          {...form.getInputProps("note")}
          radius={4}
        />

        <Group justify="right" mt="md">
          <Button radius={4} variant="default">
            Hủy
          </Button>
          <Button radius={4}>Tạo mới</Button>
        </Group>
      </Stack>
    </form>
  );
};

export default CreateBatmanTaskForm;
