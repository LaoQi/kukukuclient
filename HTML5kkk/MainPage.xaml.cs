using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Navigation;
using Microsoft.Phone.Controls;
using Microsoft.Phone.Shell;
using System.ComponentModel;

namespace HTML5kkk
{
    public partial class MainPage : PhoneApplicationPage
    {
        // 主页的 Url
        private string MainUri = "/Html/index.html";

        // 构造函数
        public MainPage()
        {
            InitializeComponent();
        }

        private void Browser_Loaded(object sender, RoutedEventArgs e)
        {
            Browser.IsScriptEnabled = true;

            // 在此处添加 URL
            Browser.Navigate(new Uri(MainUri, UriKind.Relative));
        }

        // 导航到初始“主页”。
        private void HomeMenuItem_Click(object sender, EventArgs e)
        {
            Browser.Navigate(new Uri(MainUri, UriKind.Relative));
        }

        // 捕获后退按键
        override protected void OnBackKeyPress(CancelEventArgs e)
        {
            if (Browser.CanGoBack)
            {
                Browser.GoBack();
                e.Cancel = true;
            } else
            {
                MessageBoxResult result = MessageBox.Show("确认退出？", "退出", MessageBoxButton.OKCancel);
                if (result != MessageBoxResult.OK)
                {
                    e.Cancel = true;
                }
            }
        }

        // 发串
        private void NewPostItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("发串");
        }

        private void SettingItem_Click(object sender, EventArgs e)
        {
            MessageBox.Show("设置");
        }

        // 处理导航故障。
        private void Browser_NavigationFailed(object sender, System.Windows.Navigation.NavigationFailedEventArgs e)
        {
            MessageBox.Show("无法导航到此页面，请检查 Internet 连接");
        }
    }
}
