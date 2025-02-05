export type VendingMachineAppearance = {
  id: number;
  // General Settings
  general_button_font_style: string;
  general_button_text_color: string;
  general_button_text_content_a: string;
  general_button_text_content_b: string;
  general_title_font_style: string;
  // Idle page
  idle_background_color: string;
  idle_video: string;
  idle_video_toggle: boolean;
  idle_background_image: string;
  idle_subtitle: string;
  idle_title: string;
  idle_text_color: string;
  idle_font_style: string;
  // Item selection page
  item_selection_title: string;
  // Item size page
  item_size_title: string;
  // Payment page
  payment_title: string;
  // Detect cup page
  detection_timeout: number;
  // Dispensing page
  dispensing_timeout: number;
  // Thank you page
  thank_you_background_image: string;
  thank_you_title: string;
  thank_you_subtitle: string;
  thank_you_text_color: string;
  thank_you_font_style: string;
  thank_you_exit_timeout: number;
}
