// 防止Windows发布版额外弹出控制台窗口，请勿删除下方属性！
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  app_lib::run();
}
