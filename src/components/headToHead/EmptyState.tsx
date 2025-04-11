
import { Card, CardContent } from "@/components/ui/card";

const EmptyState = () => {
  return (
    <Card>
      <CardContent className="text-center py-12">
        <p className="text-gray-500">Select two teams to see their head-to-head comparison.</p>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
