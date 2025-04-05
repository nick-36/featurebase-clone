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
import { LoaderCircle } from "lucide-react";

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
import { FilePlus } from "lucide-react";
import { formSchema, formSchemaType } from "@/lib/validation/surveyForm";
import { toast } from "sonner";
import supabase from "@/config/supabaseClient";
import { useSession } from "@/stores/authStore";

const CreateSurveyBtn = () => {
  const [open, setOpen] = useState(false);
  const { session } = useSession();
  const form = useForm<formSchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const onSubmit = async (values: formSchemaType) => {
    try {
      const { error } = await supabase.from("forms").insert([
        {
          name: values.name,
          description: values.description,
          created_at: new Date().toISOString(), // Ensure timestamp is stored correctly
          user_id: session?.user?.id, // Store user ID if authentication is enabled
        },
      ]);

      if (error) {
        throw error;
      }

      toast.success("New survey created successfully!");
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Survey creation error:", error);
      toast.error("Something went wrong! Please try again.");
    }
  };

  return (
    <Dialog modal={true} open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="group bg-background border border-primary/50 flex flex-col justify-center items-center hover:border-primary hover:cursor-pointer border-dashed gap-4 rounded-md">
          <FilePlus className="w-8 h-8 text-foreground group-hover:text-primary" />
          <p className="text-foreground font-bold text-xl group-hover:text-primary">
            Create New Survey
          </p>
        </div>
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
                disabled={form.formState.isSubmitting}
                className="w-full mt-4"
              >
                {!form.formState.isSubmitting && <span>Save</span>}
                {form.formState.isSubmitting && (
                  <LoaderCircle className="animate-spin" />
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
