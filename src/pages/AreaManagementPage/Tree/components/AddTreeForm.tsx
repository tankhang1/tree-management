import {
  Button,
  Group,
  Select,
  Stack,
  TextInput,
  Textarea,
  Divider,
  ActionIcon,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import { useForm } from "@mantine/form";
import { useState } from "react";

const AddTreeForm = () => {
  const form = useForm({
    initialValues: {
      selectType: "plot", // hoặc "row"
      plotId: "",
      rowId: "",
      treeType: "",
      method: "",
      plantedAt: "",
      trees: [{ gps: "" }],
    },
  });

  const [plotInfo] = useState({
    treeType: "Sầu riêng Ri6",
    method: "Trồng theo hố, cách 6m",
  });

  const handleAddTree = () => {
    form.insertListItem("trees", { gps: "" });
  };

  const handleRemoveTree = (index: number) => {
    form.removeListItem("trees", index);
  };

  const handleSubmit = (values: typeof form.values) => {
    console.log("Dữ liệu gửi đi:", {
      ...values,
      treeData: values.trees.map((tree) => ({
        ...tree,
        plotId: values.plotId,
        rowId: values.rowId || null,
      })),
    });
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap={"xs"}>
        <Select
          label="Loại lựa chọn"
          data={[
            { value: "plot", label: "Theo Lô" },
            { value: "row", label: "Theo Hàng" },
          ]}
          radius={4}
          {...form.getInputProps("selectType")}
        />

        <Select
          label="Lô"
          radius={4}
          placeholder="Chọn lô đã tạo"
          required
          data={[
            { value: "P001", label: "Lô A1 - Vùng A" },
            { value: "P002", label: "Lô A2 - Vùng A" },
            { value: "P003", label: "Lô B1 - Vùng B" },
          ]}
          {...form.getInputProps("plotId")}
        />

        {form.values.selectType === "row" && (
          <Select
            label="Hàng"
            radius={4}
            placeholder="Chọn hàng"
            required
            data={[
              { value: "R001", label: "Hàng 1 - Lô A1" },
              { value: "R002", label: "Hàng 2 - Lô A1" },
              { value: "R003", label: "Hàng 1 - Lô A2" },
            ]}
            {...form.getInputProps("rowId")}
          />
        )}

        <TextInput
          label="Ngày trồng"
          type="date"
          radius={4}
          required
          {...form.getInputProps("plantedAt")}
        />

        <Divider label="Thông tin lô/hàng" labelPosition="left" />
        <Stack gap="xs">
          <Select
            radius={4}
            label="Loại cây trồng"
            value={plotInfo.treeType}
            data={[
              { value: "durian_ri6", label: "Sầu riêng Ri6" },
              { value: "mango_cat_chu", label: "Xoài Cát Chu" },
              { value: "banana", label: "Chuối già Nam Mỹ" },
            ]}
            readOnly
          />
          <Select
            label="Phương pháp"
            radius={4}
            value={plotInfo.method}
            data={[
              { value: "hole_6m", label: "Trồng theo hố, cách 6m" },
              { value: "line_3m", label: "Trồng theo hàng, cách 3m" },
              { value: "random", label: "Trồng tự do" },
            ]}
            readOnly
          />
        </Stack>

        <Divider label="Danh sách cây" labelPosition="left" mt="lg" />

        <Stack>
          {form.values.trees.map((tree, index) => (
            <Group key={index} align="end" gap="xs">
              <Textarea
                radius={4}
                label={`Toạ độ GPS cây ${index + 1}`}
                placeholder="Ví dụ: 10.1234,106.1234"
                {...form.getInputProps(`trees.${index}.gps`)}
                required
                flex={1}
              />
              <ActionIcon
                color="red"
                radius={4}
                variant="light"
                onClick={() => handleRemoveTree(index)}
              >
                <IconTrash size={16} />
              </ActionIcon>
            </Group>
          ))}

          <Button
            variant="light"
            radius={4}
            leftSection={<IconPlus size={16} />}
            onClick={handleAddTree}
          >
            Thêm cây
          </Button>
        </Stack>

        <Group justify="flex-end" mt="lg">
          <Button type="submit" radius={4}>
            Lưu danh sách cây
          </Button>
        </Group>
      </Stack>
    </form>
  );
};

export default AddTreeForm;
