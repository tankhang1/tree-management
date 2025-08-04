import { Stack, Text, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import CropCards from "../../pages/AreaManagementPage/Region/Add/components/CropCards";
import { cropOptions } from "../../pages/AreaManagementPage/Row/Add";

const CatalogList = () => {
  return (
    <Stack gap={"xs"}>
      <Text fw={500} fz={15}>
        Loại cây trồng (chọn một)
      </Text>
      <TextInput
        leftSection={<IconSearch size={18} />}
        radius={4}
        placeholder="Tìm kiếm loại cây trồng"
      />
      <CropCards
        isMultiple={false}
        selected=""
        plants={cropOptions}
        onSelect={() => {}}
      />
    </Stack>
  );
};
export default CatalogList;
