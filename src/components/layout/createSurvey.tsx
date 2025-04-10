import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { LoaderCircle, FilePlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  formSchema,
  CreateSurveyFormSchemaType,
} from "@/lib/validation/surveyForm";
import { toast } from "sonner";
import { useSession } from "@/hooks/auth";
import { useCreateSurvey } from "@/hooks/mutations";
import { Plus } from "lucide-react";

const CreateSurveyBtn = ({ btnView = false }: { btnView?: boolean }) => {
  const [open, setOpen] = useState(false);
  const { session } = useSession();

  const form = useForm<CreateSurveyFormSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const { mutate, isPending } = useCreateSurvey({
    onSuccessCallback: () => {
      setOpen(false);
      form.reset();
    },
  });

  const onSubmit = (values: CreateSurveyFormSchemaType) => {
    if (!session?.user?.id) return toast.error("User not logged in");

    mutate({
      name: values.name,
      description: values.description,
    });
  };

  return (
    <Dialog modal={true} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {btnView ? (
          <Button className="cursor-pointer">
            <Plus />
            Create Survey
          </Button>
        ) : (
          <div className="min-h-[200px] group bg-background border border-primary/50 flex flex-col justify-center items-center hover:border-primary hover:cursor-pointer border-dashed gap-4 rounded-md p-4">
            <FilePlus className="w-8 h-8 text-foreground group-hover:text-primary" />
            <p className="text-foreground font-bold text-xl group-hover:text-primary">
              Create New Survey
            </p>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Survey</DialogTitle>
          <DialogDescription>
            Create a new Survey to start collecting responses
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormDescription>Name of your survey</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="rounded-md"
                      placeholder="Type your description here."
                      rows={5}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Add description for your survey
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                disabled={isPending}
                className="w-full mt-4 flex items-center justify-center gap-2 cursor-pointer"
              >
                {isPending ? (
                  <>
                    <LoaderCircle className="animate-spin w-4 h-4" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSurveyBtn;
